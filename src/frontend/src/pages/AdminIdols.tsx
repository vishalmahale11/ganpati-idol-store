import { AdminLayout } from "@/components/AdminLayout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  useAllIdols,
  useCreateIdol,
  useDeleteIdol,
  useUpdateIdol,
} from "@/hooks/use-backend";
import {
  ALL_CATEGORIES,
  type Idol,
  type IdolCategory,
  categoryLabel,
  formatPrice,
} from "@/types";
import { Edit, Eye, EyeOff, ImagePlus, Plus, Trash2, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface IdolFormData {
  name: string;
  description: string;
  category: string;
  material: string;
  heightCm: string;
  price: string;
  stockQuantity: string;
  isActive: boolean;
  images: string[];
}

const defaultForm: IdolFormData = {
  name: "",
  description: "",
  category: "Clay",
  material: "",
  heightCm: "",
  price: "",
  stockQuantity: "",
  isActive: true,
  images: [],
};

function categoryFromString(s: string): IdolCategory {
  const found = ALL_CATEGORIES.find(
    (c) => categoryLabel(c.value) === s || Object.keys(c.value)[0] === s,
  );
  return found?.value ?? { Clay: null };
}

function ImageUploadSection({
  images,
  onChange,
}: {
  images: string[];
  onChange: (imgs: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  async function readFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const remaining = 10 - images.length;
    const toProcess = Array.from(files).slice(0, remaining);
    const results = await Promise.all(
      toProcess.map(
        (file) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.readAsDataURL(file);
          }),
      ),
    );
    onChange([...images, ...results]);
  }

  function removeImage(idx: number) {
    onChange(images.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-2">
      <Label className="text-xs">Images (up to 10)</Label>

      {/* Drag-and-drop zone */}
      <button
        type="button"
        data-ocid="admin.idol_form.image.dropzone"
        aria-label="Upload idol images"
        disabled={images.length >= 10}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          readFiles(e.dataTransfer.files);
        }}
        className={`w-full border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-smooth text-center min-h-[96px] disabled:opacity-50 disabled:cursor-not-allowed ${
          dragOver
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-muted/30"
        }`}
      >
        <ImagePlus className="w-6 h-6 text-muted-foreground mb-1.5" />
        <p className="text-xs text-muted-foreground">
          {images.length >= 10
            ? "Maximum 10 images reached"
            : "Drag & drop or click to upload images"}
        </p>
        <p className="text-xs text-muted-foreground/60 mt-0.5">
          PNG, JPG, WebP — up to 10
        </p>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        data-ocid="admin.idol_form.image.upload_button"
        onChange={(e) => readFiles(e.target.files)}
      />

      {/* Image preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-5 gap-2 mt-2">
          {images.map((src, idx) => (
            <div
              key={src.slice(0, 40)}
              className="relative group rounded-lg overflow-hidden border border-border aspect-square bg-muted"
              data-ocid={`admin.idol_form.image.item.${idx + 1}`}
            >
              <img
                src={src}
                alt={`Idol ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                aria-label="Remove image"
                data-ocid={`admin.idol_form.image.delete_button.${idx + 1}`}
                className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function AdminIdolsPage() {
  const { data: idols = [], isLoading } = useAllIdols();
  const deleteIdol = useDeleteIdol();
  const updateIdol = useUpdateIdol();
  const createIdol = useCreateIdol();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIdol, setEditingIdol] = useState<Idol | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Idol | null>(null);
  const [form, setForm] = useState<IdolFormData>(defaultForm);

  function openCreate() {
    setEditingIdol(null);
    setForm(defaultForm);
    setDialogOpen(true);
  }

  function openEdit(idol: Idol) {
    setEditingIdol(idol);
    setForm({
      name: idol.name,
      description: idol.description,
      category: Object.keys(idol.category)[0],
      material: idol.material,
      heightCm: idol.heightCm.toString(),
      price: idol.price.toString(),
      stockQuantity: idol.stockQuantity.toString(),
      isActive: idol.isActive,
      images: idol.images,
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!form.name || !form.material || !form.price || !form.heightCm) {
      toast.error("Please fill all required fields");
      return;
    }
    const cat = categoryFromString(form.category);
    try {
      if (editingIdol) {
        await updateIdol.mutateAsync({
          ...editingIdol,
          name: form.name,
          description: form.description,
          category: cat,
          material: form.material,
          heightCm: BigInt(form.heightCm || "0"),
          price: BigInt(form.price || "0"),
          stockQuantity: BigInt(form.stockQuantity || "0"),
          isActive: form.isActive,
          images: form.images,
        });
        toast.success("Idol updated successfully");
      } else {
        await createIdol.mutateAsync({
          name: form.name,
          description: form.description,
          category: cat,
          material: form.material,
          heightCm: BigInt(form.heightCm || "0"),
          price: BigInt(form.price || "0"),
          images: form.images,
          stockQuantity: BigInt(form.stockQuantity || "0"),
          isActive: form.isActive,
        });
        toast.success("Idol created successfully");
      }
      setDialogOpen(false);
    } catch {
      toast.error("Failed to save idol");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteIdol.mutateAsync(deleteTarget.id);
      toast.success("Idol deleted");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete idol");
    }
  }

  async function toggleActive(idol: Idol) {
    await updateIdol.mutateAsync({ ...idol, isActive: !idol.isActive });
    toast.success(
      idol.isActive ? "Idol hidden from catalog" : "Idol shown in catalog",
    );
  }

  return (
    <AdminLayout>
      <div data-ocid="admin.idols.page">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Manage Idols
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {idols.length} idols in catalog
            </p>
          </div>
          <Button
            onClick={openCreate}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth"
            data-ocid="admin.idols.add.primary_button"
          >
            <Plus className="w-4 h-4" />
            Add Idol
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }, (_, i) => `skel-${i}`).map((key) => (
              <div
                key={key}
                className="bg-card border border-border rounded-xl h-16 animate-pulse"
              />
            ))}
          </div>
        ) : idols.length === 0 ? (
          <div
            className="text-center py-20 bg-card rounded-xl border border-border"
            data-ocid="admin.idols.empty_state"
          >
            <div className="text-4xl mb-3">🪔</div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">
              No Idols Yet
            </h3>
            <p className="text-muted-foreground text-sm mb-5">
              Add your first Ganpati idol to the catalog
            </p>
            <Button
              onClick={openCreate}
              className="gap-2 bg-primary text-primary-foreground"
              data-ocid="admin.idols.empty_state.add.button"
            >
              <Plus className="w-4 h-4" />
              Add First Idol
            </Button>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-subtle">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">
                    Idol
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground hidden md:table-cell">
                    Category
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground hidden md:table-cell">
                    Price
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground hidden md:table-cell">
                    Stock
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {idols.map((idol, i) => (
                  <tr
                    key={idol.id.toString()}
                    className="hover:bg-muted/30 transition-smooth"
                    data-ocid={`admin.idols.item.${i + 1}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-muted overflow-hidden shrink-0">
                          {idol.images[0] ? (
                            <img
                              src={idol.images[0]}
                              alt={idol.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-lg">
                              🪔
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate text-xs">
                            {idol.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {idol.material}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <Badge className="bg-primary/10 text-primary border-primary/30 text-xs">
                        {categoryLabel(idol.category)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right hidden md:table-cell">
                      <span className="font-semibold text-foreground text-xs">
                        {formatPrice(idol.price)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center hidden md:table-cell">
                      <span className="text-xs text-muted-foreground">
                        {Number(idol.stockQuantity)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => toggleActive(idol)}
                        data-ocid={`admin.idols.toggle_active.${i + 1}`}
                        className="inline-flex items-center gap-1.5 text-xs transition-smooth"
                      >
                        {idol.isActive ? (
                          <Badge className="bg-primary/10 text-primary border-primary/30 text-xs gap-1 cursor-pointer">
                            <Eye className="w-2.5 h-2.5" /> Active
                          </Badge>
                        ) : (
                          <Badge className="bg-muted text-muted-foreground text-xs gap-1 cursor-pointer">
                            <EyeOff className="w-2.5 h-2.5" /> Hidden
                          </Badge>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEdit(idol)}
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-primary"
                          data-ocid={`admin.idols.edit_button.${i + 1}`}
                          aria-label="Edit idol"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteTarget(idol)}
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                          data-ocid={`admin.idols.delete_button.${i + 1}`}
                          aria-label="Delete idol"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent
            className="max-w-lg max-h-[90vh] overflow-y-auto"
            data-ocid="admin.idol_form.dialog"
          >
            <DialogHeader>
              <DialogTitle className="font-display">
                {editingIdol ? "Edit Idol" : "Add New Idol"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="Shubh Drishti Ganpati"
                  data-ocid="admin.idol_form.name.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Description</Label>
                <Textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  placeholder="Describe this sacred idol…"
                  data-ocid="admin.idol_form.description.textarea"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Category</Label>
                  <Select
                    value={form.category}
                    onValueChange={(v) =>
                      setForm((f) => ({ ...f, category: v }))
                    }
                  >
                    <SelectTrigger data-ocid="admin.idol_form.category.select">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {ALL_CATEGORIES.map((c) => (
                        <SelectItem
                          key={c.label}
                          value={Object.keys(c.value)[0]}
                        >
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Material *</Label>
                  <Input
                    value={form.material}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, material: e.target.value }))
                    }
                    placeholder="White Marble"
                    data-ocid="admin.idol_form.material.input"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Height (cm) *</Label>
                  <Input
                    type="number"
                    value={form.heightCm}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, heightCm: e.target.value }))
                    }
                    placeholder="30"
                    data-ocid="admin.idol_form.height.input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Price (₹) *</Label>
                  <Input
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, price: e.target.value }))
                    }
                    placeholder="4500"
                    data-ocid="admin.idol_form.price.input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Stock Qty</Label>
                  <Input
                    type="number"
                    value={form.stockQuantity}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        stockQuantity: e.target.value,
                      }))
                    }
                    placeholder="10"
                    data-ocid="admin.idol_form.stock.input"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <ImageUploadSection
                images={form.images}
                onChange={(imgs) => setForm((f) => ({ ...f, images: imgs }))}
              />

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, isActive: e.target.checked }))
                  }
                  className="w-4 h-4 accent-primary"
                  data-ocid="admin.idol_form.active.checkbox"
                />
                <Label htmlFor="isActive" className="text-xs cursor-pointer">
                  Visible in public catalog
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
                data-ocid="admin.idol_form.cancel.cancel_button"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={createIdol.isPending || updateIdol.isPending}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                data-ocid="admin.idol_form.save.submit_button"
              >
                {editingIdol ? "Save Changes" : "Create Idol"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirm */}
        <AlertDialog
          open={!!deleteTarget}
          onOpenChange={(o) => {
            if (!o) setDeleteTarget(null);
          }}
        >
          <AlertDialogContent data-ocid="admin.idol_delete.dialog">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-display">
                Delete Idol?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove{" "}
                <strong>{deleteTarget?.name}</strong> from the catalog. This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel data-ocid="admin.idol_delete.cancel.cancel_button">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                data-ocid="admin.idol_delete.confirm.confirm_button"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    Crown,
    Edit3,
    ImageIcon,
    Plus,
    Search,
    Star,
    Trash2,
    Upload,
    Video,
    X,
} from "lucide-react";

import {
    createSignatureProduct,
    deleteSignatureProduct,
    getAdminSignatureProducts,
    updateSignatureProduct,
} from "../services/signatureProductApi";

const initialForm = {
    name: "",
    shortDescription: "",
    originalPrice: "",
    discountPrice: "",
    stock: "",
    sku: "",
    videoUrl: "",
    isActive: true,
    isPrimary: false,
    newImages: [],
    newPreviews: [],
    existingImages: [],
    removeImageIds: [],
};

function AdminSignatureProducts() {
    const queryClient = useQueryClient();

    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [form, setForm] = useState(initialForm);

    const {
        data,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["admin-signature-products"],
        queryFn: getAdminSignatureProducts,
    });

    const products = Array.isArray(data)
        ? data
        : [];

    const filteredProducts = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        if (!keyword) {
            return products;
        }

        return products.filter((product) =>
            product.name?.toLowerCase().includes(keyword)
        );
    }, [products, search]);

    const refreshProducts = async () => {
        await Promise.all([
            queryClient.invalidateQueries({
                queryKey: ["admin-signature-products"],
            }),
            queryClient.invalidateQueries({
                queryKey: ["signature-products"],
            }),
            queryClient.invalidateQueries({
                queryKey: ["primary-signature-product"],
            }),
        ]);
    };

    const createMutation = useMutation({
        mutationFn: createSignatureProduct,

        onSuccess: async () => {
            await refreshProducts();
            closeModal();
        },
    });

    const updateMutation = useMutation({
        mutationFn: updateSignatureProduct,

        onSuccess: async () => {
            await refreshProducts();
            closeModal();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteSignatureProduct,

        onSuccess: async () => {
            await refreshProducts();
            setDeleteTarget(null);
        },
    });

    const openCreateModal = () => {
        setEditingProduct(null);
        setForm(initialForm);
        setModalOpen(true);
    };

    const openEditModal = (product) => {
        setEditingProduct(product);

        setForm({
            name: product.name || "",
            shortDescription: product.shortDescription || "",
            originalPrice: product.originalPrice ?? "",
            discountPrice: product.discountPrice ?? "",
            stock: product.stock ?? "",
            sku: product.sku || "",
            videoUrl: product.videoUrl || "",
            isActive: product.isActive ?? true,
            isPrimary: product.isPrimary ?? false,
            newImages: [],
            newPreviews: [],
            existingImages: product.images || [],
            removeImageIds: [],
        });

        setModalOpen(true);
    };

    const closeModal = () => {
        form.newPreviews.forEach((preview) => {
            URL.revokeObjectURL(preview);
        });

        setModalOpen(false);
        setEditingProduct(null);
        setForm(initialForm);

        createMutation.reset();
        updateMutation.reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = new FormData();

        data.append("name", form.name.trim());
        data.append("shortDescription", form.shortDescription.trim());
        data.append("originalPrice", String(form.originalPrice));
        data.append("discountPrice", String(form.discountPrice));
        data.append("stock", String(form.stock));
        data.append("sku", form.sku.trim());
        data.append("videoUrl", form.videoUrl.trim());
        data.append("isActive", String(form.isActive));
        data.append("isPrimary", String(form.isPrimary));

        form.newImages.forEach((image) => {
            data.append("images", image);
        });

        if (editingProduct) {
            data.append(
                "removeImageIds",
                JSON.stringify(form.removeImageIds)
            );

            updateMutation.mutate({
                id: editingProduct.id,
                formData: data,
            });

            return;
        }

        createMutation.mutate(data);
    };

    const saving =
        createMutation.isPending ||
        updateMutation.isPending;

    return (
        <div>
            {/* HEADER */}

            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#b07a42]">
                        Signature Collection
                    </p>

                    <h1 className="font-beauty mt-1 text-[30px] font-semibold text-[#45292f] sm:text-4xl dark:text-[#f5e8eb]">
                        Signature Products
                    </h1>

                    <p className="mt-1.5 max-w-[520px] text-[9px] text-[#92777d] sm:text-xs dark:text-[#a99297]">
                        Manage KM Cares&apos;s main premium products separately from the normal store catalog.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={openCreateModal}
                    className="inline-flex w-fit items-center gap-2 rounded-[11px] bg-[#793747] px-4 py-2.5 text-[8px] font-semibold text-white shadow-[0_7px_20px_rgba(121,55,71,0.16)] transition hover:bg-[#642d3a] sm:text-[9px]"
                >
                    <Plus size={13} />
                    Add Signature Product
                </button>
            </div>

            {/* SEARCH */}

            <div className="mb-4 flex flex-col gap-2.5 rounded-[15px] border border-[#e8dad7] bg-white p-2.5 sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-[#1b1518]">
                <div className="flex w-full max-w-[330px] items-center rounded-[10px] border border-[#e6d8d5] bg-[#fcf8f7] px-2.5 dark:border-white/10 dark:bg-[#120e10]">
                    <Search size={13} className="shrink-0 text-[#9e747c]" />

                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search signature products..."
                        className="w-full bg-transparent px-2.5 py-2.5 text-[9px] text-[#513c41] outline-none placeholder:text-[#b29ca1] sm:text-[10px] dark:text-white"
                    />
                </div>

                <p className="text-[7px] font-semibold uppercase tracking-[0.14em] text-[#a1868c] sm:text-[8px]">
                    {products.length} Signature Products
                </p>
            </div>

            {/* PRODUCTS */}

            {isLoading ? (
                <ProductSkeleton />
            ) : isError ? (
                <div className="rounded-[18px] border border-red-200 bg-red-50 p-7 text-center text-[10px] text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                    Unable to load signature products.
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="rounded-[22px] border border-dashed border-[#d9c3bd] bg-white px-6 py-14 text-center dark:border-white/10 dark:bg-[#1b1518]">
                    <Crown size={28} className="mx-auto text-[#c5924d]" />

                    <h2 className="font-beauty mt-3 text-[25px] font-semibold text-[#503039] dark:text-[#f0dce1]">
                        No signature products yet
                    </h2>

                    <p className="mt-2 text-[9px] text-[#9b8388]">
                        Add Zafrani Night Cream or another premium KM Cares product.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
                    {filteredProducts.map((product) => (
                        <SignatureCard
                            key={product.id}
                            product={product}
                            onEdit={() => openEditModal(product)}
                            onDelete={() => setDeleteTarget(product)}
                        />
                    ))}
                </div>
            )}

            {/* CREATE / EDIT */}

            {modalOpen && (
                <SignatureProductModal
                    form={form}
                    setForm={setForm}
                    editing={Boolean(editingProduct)}
                    saving={saving}
                    error={
                        createMutation.error?.response?.data?.message ||
                        updateMutation.error?.response?.data?.message
                    }
                    onClose={closeModal}
                    onSubmit={handleSubmit}
                />
            )}

            {/* DELETE */}

            {deleteTarget && (
                <DeleteModal
                    product={deleteTarget}
                    deleting={deleteMutation.isPending}
                    error={deleteMutation.error?.response?.data?.message}
                    onCancel={() => {
                        setDeleteTarget(null);
                        deleteMutation.reset();
                    }}
                    onDelete={() =>
                        deleteMutation.mutate(deleteTarget.id)
                    }
                />
            )}
        </div>
    );
}

/* =====================================================
   CARD
===================================================== */

function SignatureCard({
    product,
    onEdit,
    onDelete,
}) {
    const image =
        product.images?.[0]?.imageUrl;

    const finalPrice =
        product.discountPrice ??
        product.originalPrice;

    return (
        <article className="group overflow-hidden rounded-[15px] border border-[#e3d5cf] bg-white shadow-[0_5px_18px_rgba(70,41,47,0.05)] transition hover:-translate-y-0.5 hover:border-[#d0ad95] dark:border-white/10 dark:bg-[#1b1518]">
            <div className="relative h-[105px] overflow-hidden bg-[#fff5f1] sm:h-[125px] dark:bg-[#25191c]">

                {image ? (
                    <img
                        src={image}
                        alt={product.name}
                        className="
                        h-full
                        w-full
                        object-contain
                        object-center
                        transition
                        duration-500
                        group-hover:scale-[1.02]
                        "
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <ImageIcon size={20} className="text-[#bb9388]" />
                    </div>
                )}

                {product.isPrimary && (
                    <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-full bg-[#c49445] px-2 py-1 text-[5px] font-bold uppercase tracking-[0.08em] text-white sm:text-[6px]">
                        <Crown size={7} />
                        Primary
                    </span>
                )}

                {product.videoUrl && (
                    <span className="absolute bottom-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/65 text-white">
                        <Video size={10} />
                    </span>
                )}
            </div>

            <div className="p-2.5">
                <p className="text-[5px] font-bold uppercase tracking-[0.13em] text-[#b07a42]">
                    Signature
                </p>

                <h2 className="font-beauty mt-1 truncate text-[14px] font-semibold text-[#4c3036] sm:text-[16px] dark:text-[#f3e5e8]">
                    {product.name}
                </h2>

                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span className="text-[9px] font-bold text-[#793747] dark:text-[#eab7c1]">
                        Rs. {Number(finalPrice).toLocaleString()}
                    </span>

                    {product.discountPrice && (
                        <span className="text-[6px] text-[#a78d92] line-through">
                            Rs. {Number(product.originalPrice).toLocaleString()}
                        </span>
                    )}
                </div>

                <div className="mt-2 flex items-center justify-between text-[6px] text-[#978086]">
                    <span>
                        Stock: {product.stock}
                    </span>

                    <span className={product.isActive ? "text-emerald-600" : "text-red-500"}>
                        {product.isActive ? "Active" : "Hidden"}
                    </span>
                </div>

                <div className="mt-2.5 grid grid-cols-2 gap-1.5">
                    <button
                        type="button"
                        onClick={onEdit}
                        className="flex items-center justify-center gap-1 rounded-[8px] bg-[#f3e5e2] px-2 py-2 text-[6px] font-bold text-[#793747] transition hover:bg-[#ead5d1] dark:bg-white/5 dark:text-[#e8bdc6]"
                    >
                        <Edit3 size={9} />
                        Edit
                    </button>

                    <button
                        type="button"
                        onClick={onDelete}
                        className="flex items-center justify-center gap-1 rounded-[8px] bg-red-50 px-2 py-2 text-[6px] font-bold text-red-500 transition hover:bg-red-100 dark:bg-red-500/10"
                    >
                        <Trash2 size={9} />
                        Delete
                    </button>
                </div>
            </div>
        </article>
    );
}

/* =====================================================
   MODAL
===================================================== */

function SignatureProductModal({
    form,
    setForm,
    editing,
    saving,
    error,
    onClose,
    onSubmit,
}) {
    const visibleExisting =
        form.existingImages.filter(
            (image) =>
                !form.removeImageIds.includes(image.id)
        );

    const totalImages =
        visibleExisting.length +
        form.newImages.length;

    const handleImages = (e) => {
        const files =
            Array.from(e.target.files || []);

        const allowed =
            Math.max(
                0,
                5 - totalImages
            );

        const selected =
            files.slice(0, allowed);

        const previews =
            selected.map((file) =>
                URL.createObjectURL(file)
            );

        setForm((previous) => ({
            ...previous,
            newImages: [
                ...previous.newImages,
                ...selected,
            ],
            newPreviews: [
                ...previous.newPreviews,
                ...previews,
            ],
        }));

        e.target.value = "";
    };

    const removeNewImage = (index) => {
        URL.revokeObjectURL(
            form.newPreviews[index]
        );

        setForm((previous) => ({
            ...previous,

            newImages:
                previous.newImages.filter(
                    (_, i) => i !== index
                ),

            newPreviews:
                previous.newPreviews.filter(
                    (_, i) => i !== index
                ),
        }));
    };

    const discountPercent = (() => {
        const original =
            Number(form.originalPrice);

        const discount =
            Number(form.discountPrice);

        if (
            !original ||
            !discount ||
            discount >= original
        ) {
            return 0;
        }

        return Math.round(
            ((original - discount) /
                original) *
            100
        );
    })();

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm sm:p-5">
            <div className="max-h-[94vh] w-full max-w-[820px] overflow-y-auto rounded-[22px] border border-[#e6d5d1] bg-[#fffaf8] shadow-2xl dark:border-white/10 dark:bg-[#191315]">
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#eadbd8] bg-[#fffaf8]/95 px-4 py-3 backdrop-blur-xl sm:px-5 dark:border-white/10 dark:bg-[#191315]/95">
                    <div>
                        <p className="text-[7px] font-bold uppercase tracking-[0.18em] text-[#b17d42]">
                            Signature Collection
                        </p>

                        <h2 className="font-beauty mt-0.5 text-[23px] font-semibold text-[#4c3036] dark:text-[#f4e6e8]">
                            {editing
                                ? "Edit Signature Product"
                                : "Add Signature Product"}
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e3d2ce] bg-white text-[#72545a] dark:border-white/10 dark:bg-white/5"
                    >
                        <X size={14} />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="space-y-4 p-4 sm:space-y-5 sm:p-5">
                    <FormField label="Product Name">
                        <input
                            required
                            value={form.name}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    name: e.target.value,
                                })
                            }
                            className={inputClass}
                            placeholder="Zafrani Night Cream"
                        />
                    </FormField>

                    <FormField label="Short Description">
                        <textarea
                            rows="3"
                            value={form.shortDescription}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    shortDescription: e.target.value,
                                })
                            }
                            className={`${inputClass} resize-none`}
                            placeholder="Premium signature product description..."
                        />
                    </FormField>

                    <div className="grid gap-3 sm:grid-cols-3">
                        <FormField label="Original Price">
                            <input
                                required
                                type="number"
                                min="1"
                                step="0.01"
                                value={form.originalPrice}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        originalPrice: e.target.value,
                                    })
                                }
                                className={inputClass}
                                placeholder="2500"
                            />
                        </FormField>

                        <FormField label="Discount Price">
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.discountPrice}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        discountPrice: e.target.value,
                                    })
                                }
                                className={inputClass}
                                placeholder="1999"
                            />
                        </FormField>

                        <FormField label="Discount">
                            <div className="flex min-h-[38px] items-center justify-center rounded-[10px] bg-[#f2e4d7] text-[10px] font-bold text-[#9a692e] dark:bg-[#30251d] dark:text-[#e5b970]">
                                {discountPercent}% OFF
                            </div>
                        </FormField>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        <FormField label="Stock">
                            <input
                                required
                                type="number"
                                min="0"
                                value={form.stock}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        stock: e.target.value,
                                    })
                                }
                                className={inputClass}
                                placeholder="50"
                            />
                        </FormField>

                        <FormField label="SKU">
                            <input
                                value={form.sku}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        sku: e.target.value,
                                    })
                                }
                                className={inputClass}
                                placeholder="HG-ZAF-001"
                            />
                        </FormField>
                    </div>

                    {/* VIDEO */}

                    <FormField label="YouTube Video URL">
                        <div className="relative">
                            <Video size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b08069]" />

                            <input
                                type="url"
                                value={form.videoUrl}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        videoUrl: e.target.value,
                                    })
                                }
                                className={`${inputClass} pl-9`}
                                placeholder="https://www.youtube.com/watch?v=..."
                            />
                        </div>

                        <p className="mt-1.5 text-[7px] text-[#a38b90]">
                            Optional · Video will belong only to this signature product.
                        </p>
                    </FormField>

                    {/* CURRENT IMAGES */}

                    {visibleExisting.length > 0 && (
                        <FormField label="Current Images">
                            <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                                {visibleExisting.map((image) => (
                                    <div
                                        key={image.id}
                                        className="relative aspect-square overflow-hidden rounded-[10px] border border-[#e5d6d2]"
                                    >
                                        <img
                                            src={image.imageUrl}
                                            alt=""
                                            className="h-full w-full object-cover"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setForm((previous) => ({
                                                    ...previous,
                                                    removeImageIds: [
                                                        ...previous.removeImageIds,
                                                        image.id,
                                                    ],
                                                }))
                                            }
                                            className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-white hover:bg-red-500"
                                        >
                                            <X size={9} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </FormField>
                    )}

                    {/* NEW IMAGES */}

                    <FormField label={`Product Images (${totalImages}/5)`}>
                        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                            {form.newPreviews.map((preview, index) => (
                                <div
                                    key={preview}
                                    className="relative aspect-square overflow-hidden rounded-[10px] border border-[#e5d6d2]"
                                >
                                    <img
                                        src={preview}
                                        alt=""
                                        className="h-full w-full object-cover"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => removeNewImage(index)}
                                        className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-white hover:bg-red-500"
                                    >
                                        <X size={9} />
                                    </button>
                                </div>
                            ))}

                            {totalImages < 5 && (
                                <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-[10px] border-2 border-dashed border-[#d7c1bc] bg-[#faf2ef] text-[#8d5963] dark:border-white/10 dark:bg-[#120e10]">
                                    <Upload size={15} />

                                    <span className="mt-1 text-[6px] font-semibold">
                                        Add Image
                                    </span>

                                    <input
                                        type="file"
                                        multiple
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={handleImages}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>
                    </FormField>

                    {/* OPTIONS */}

                    <div className="grid gap-2.5 sm:grid-cols-2">
                        <ToggleBox
                            title="Active"
                            subtitle="Show product on website"
                            checked={form.isActive}
                            onChange={(checked) =>
                                setForm({
                                    ...form,
                                    isActive: checked,
                                })
                            }
                        />

                        <ToggleBox
                            title="Primary Signature"
                            subtitle="Show as main flagship product"
                            checked={form.isPrimary}
                            onChange={(checked) =>
                                setForm({
                                    ...form,
                                    isPrimary: checked,
                                })
                            }
                        />
                    </div>

                    {error && (
                        <div className="rounded-[10px] bg-red-50 px-3 py-2.5 text-[9px] text-red-600 dark:bg-red-500/10 dark:text-red-300">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end gap-2 border-t border-[#eadcd9] pt-4 dark:border-white/10">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="rounded-[10px] border border-[#dfcfcc] px-4 py-2.5 text-[8px] font-semibold text-[#71545a] disabled:opacity-50 dark:border-white/10 dark:text-[#d6c0c5]"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={
                                saving ||
                                !form.name.trim() ||
                                !form.originalPrice ||
                                !form.stock ||
                                totalImages < 1
                            }
                            className="rounded-[10px] bg-[#793747] px-5 py-2.5 text-[8px] font-semibold text-white transition hover:bg-[#622c39] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {saving
                                ? "Saving..."
                                : editing
                                    ? "Save Changes"
                                    : "Create Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* =====================================================
   DELETE MODAL
===================================================== */

function DeleteModal({
    product,
    deleting,
    error,
    onCancel,
    onDelete,
}) {
    return (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-[370px] rounded-[20px] border border-[#ead8d5] bg-white p-5 shadow-2xl dark:border-white/10 dark:bg-[#1b1518]">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-500 dark:bg-red-500/10">
                    <Trash2 size={15} />
                </div>

                <h2 className="font-beauty mt-3 text-[24px] font-semibold text-[#4d3037] dark:text-[#f3e4e7]">
                    Delete signature product?
                </h2>

                <p className="mt-2 text-[9px] leading-5 text-[#8e757a]">
                    Delete{" "}
                    <strong className="text-[#624047] dark:text-[#e3cbd0]">
                        {product.name}
                    </strong>
                    ? Its uploaded images will also be removed.
                </p>

                {error && (
                    <p className="mt-3 rounded-[10px] bg-red-50 px-3 py-2 text-[8px] text-red-500 dark:bg-red-500/10">
                        {error}
                    </p>
                )}

                <div className="mt-5 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={deleting}
                        className="rounded-[9px] border border-[#decac7] px-3.5 py-2.5 text-[8px] font-semibold text-[#72565c] disabled:opacity-50 dark:border-white/10 dark:text-[#cfb9be]"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onDelete}
                        disabled={deleting}
                        className="rounded-[9px] bg-red-500 px-3.5 py-2.5 text-[8px] font-semibold text-white transition hover:bg-red-600 disabled:opacity-50"
                    >
                        {deleting
                            ? "Deleting..."
                            : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}

function ToggleBox({
    title,
    subtitle,
    checked,
    onChange,
}) {
    return (
        <label className="flex cursor-pointer items-center justify-between rounded-[13px] border border-[#e5d6d3] bg-white p-3 transition hover:border-[#d2b4b3] dark:border-white/10 dark:bg-[#120e10]">
            <div className="min-w-0">
                <p className="text-[9px] font-semibold text-[#553a40] dark:text-[#e4d0d4]">
                    {title}
                </p>

                <p className="mt-0.5 truncate text-[7px] text-[#a18b90]">
                    {subtitle}
                </p>
            </div>

            <input
                type="checkbox"
                checked={checked}
                onChange={(e) =>
                    onChange(e.target.checked)
                }
                className="ml-2 h-3.5 w-3.5 shrink-0 accent-[#793747]"
            />
        </label>
    );
}

function FormField({
    label,
    children,
}) {
    return (
        <div>
            <label className="mb-1.5 block text-[7px] font-bold uppercase tracking-[0.14em] text-[#795c62] sm:text-[8px] dark:text-[#bea7ac]">
                {label}
            </label>

            {children}
        </div>
    );
}

function ProductSkeleton() {
    return (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
            {Array.from({
                length: 5,
            }).map((_, index) => (
                <div
                    key={index}
                    className="animate-pulse overflow-hidden rounded-[15px] border border-[#e8d9d6] bg-white dark:border-white/10 dark:bg-[#1b1518]"
                >
                    <div className="h-[110px] bg-[#efe0da] dark:bg-white/5" />

                    <div className="space-y-2 p-2.5">
                        <div className="h-2 w-12 rounded bg-[#eee2df] dark:bg-white/5" />
                        <div className="h-4 w-3/4 rounded bg-[#eee2df] dark:bg-white/5" />
                        <div className="h-3 w-16 rounded bg-[#eee2df] dark:bg-white/5" />
                    </div>
                </div>
            ))}
        </div>
    );
}

const inputClass = "w-full rounded-[10px] border border-[#e3d4d1] bg-white px-3 py-2.5 text-[9px] text-[#513b40] outline-none transition placeholder:text-[#b9a3a7] focus:border-[#a55b69] sm:text-[10px] dark:border-white/10 dark:bg-[#120e10] dark:text-white";

export default AdminSignatureProducts;
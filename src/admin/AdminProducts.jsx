import {
  useMemo,
  useState,
} from "react";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  Edit3,
  ImageIcon,
  Package,
  Plus,
  Search,
  Star,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import {
  createProduct,
  deleteProduct,
  getAdminProducts,
  updateProduct,
} from "../services/productApi";

import {
  getAdminCategories,
} from "../services/categoryApi";

/* =====================================================
   INITIAL FORM
===================================================== */

const initialForm = {
  name: "",
  shortDescription: "",

  originalPrice: "",
  discountPrice: "",

  stock: "",
  sku: "",

  categoryId: "",

  isActive: true,
  isFeatured: false,

  newImages: [],
  newPreviews: [],

  existingImages: [],
  removeImageIds: [],
};

/* =====================================================
   ADMIN PRODUCTS
===================================================== */

function AdminProducts() {
  const queryClient =
    useQueryClient();

  const [search, setSearch] =
    useState("");

  const [
    modalOpen,
    setModalOpen,
  ] = useState(false);

  const [
    editingProduct,
    setEditingProduct,
  ] = useState(null);

  const [
    deleteTarget,
    setDeleteTarget,
  ] = useState(null);

  const [form, setForm] =
    useState(initialForm);

  /* ===================================================
     GET PRODUCTS
  =================================================== */

  const {
    data: productsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "admin-products",
    ],

    queryFn:
      getAdminProducts,
  });

  /* ===================================================
     GET CATEGORIES
  =================================================== */

  const {
    data: categoriesData,
  } = useQuery({
    queryKey: [
      "admin-categories",
    ],

    queryFn:
      getAdminCategories,
  });

  const products =
    Array.isArray(
      productsData
    )
      ? productsData
      : [];

  const categories =
    Array.isArray(
      categoriesData
    )
      ? categoriesData
      : [];

  /* ===================================================
     CREATE PRODUCT
  =================================================== */

  const createMutation =
    useMutation({
      mutationFn:
        createProduct,

      onSuccess: async () => {
        await refreshProducts();

        closeModal();
      },
    });

  /* ===================================================
     UPDATE PRODUCT
  =================================================== */

  const updateMutation =
    useMutation({
      mutationFn:
        updateProduct,

      onSuccess: async () => {
        await refreshProducts();

        closeModal();
      },
    });

  /* ===================================================
     DELETE PRODUCT
  =================================================== */

  const deleteMutation =
    useMutation({
      mutationFn:
        deleteProduct,

      onSuccess: async () => {
        await refreshProducts();

        setDeleteTarget(
          null
        );
      },
    });

  /* ===================================================
     REFRESH QUERIES
  =================================================== */

  async function refreshProducts() {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: [
          "admin-products",
        ],
      }),

      queryClient.invalidateQueries({
        queryKey: [
          "products",
        ],
      }),

      queryClient.invalidateQueries({
        queryKey: [
          "featured-products",
        ],
      }),
    ]);
  }

  /* ===================================================
     SEARCH
  =================================================== */

  const filteredProducts =
    useMemo(() => {
      const keyword =
        search
          .trim()
          .toLowerCase();

      if (!keyword) {
        return products;
      }

      return products.filter(
        (product) =>
          product.name
            ?.toLowerCase()
            .includes(
              keyword
            )
      );
    }, [
      products,
      search,
    ]);

  /* ===================================================
     CREATE MODAL
  =================================================== */

  const openCreateModal =
    () => {
      setEditingProduct(
        null
      );

      setForm(
        initialForm
      );

      setModalOpen(
        true
      );
    };

  /* ===================================================
     EDIT MODAL
  =================================================== */

  const openEditModal = (
    product
  ) => {
    setEditingProduct(
      product
    );

    setForm({
      name:
        product.name ||
        "",

      shortDescription:
        product.shortDescription ||
        "",

      originalPrice:
        product.originalPrice ??
        "",

      discountPrice:
        product.discountPrice ??
        "",

      stock:
        product.stock ??
        "",

      sku:
        product.sku ||
        "",

      categoryId:
        String(
          product.categoryId ||
            ""
        ),

      isActive:
        product.isActive ??
        true,

      isFeatured:
        product.isFeatured ??
        false,

      newImages: [],

      newPreviews: [],

      existingImages:
        product.images ||
        [],

      removeImageIds: [],
    });

    setModalOpen(
      true
    );
  };

  /* ===================================================
     CLOSE MODAL
  =================================================== */

  const closeModal = () => {
    form.newPreviews.forEach(
      (preview) => {
        URL.revokeObjectURL(
          preview
        );
      }
    );

    setModalOpen(
      false
    );

    setEditingProduct(
      null
    );

    setForm(
      initialForm
    );

    createMutation.reset();

    updateMutation.reset();
  };

  /* ===================================================
     SUBMIT
  =================================================== */

  const handleSubmit = (
    e
  ) => {
    e.preventDefault();

    const data =
      new FormData();

    data.append(
      "name",
      form.name.trim()
    );

    data.append(
      "shortDescription",
      form.shortDescription.trim()
    );

    data.append(
      "originalPrice",
      String(
        form.originalPrice
      )
    );

    data.append(
      "discountPrice",
      String(
        form.discountPrice
      )
    );

    data.append(
      "stock",
      String(
        form.stock
      )
    );

    data.append(
      "sku",
      form.sku.trim()
    );

    data.append(
      "categoryId",
      String(
        form.categoryId
      )
    );

    data.append(
      "isActive",
      String(
        form.isActive
      )
    );

    data.append(
      "isFeatured",
      String(
        form.isFeatured
      )
    );

    form.newImages.forEach(
      (image) => {
        data.append(
          "images",
          image
        );
      }
    );

    if (
      editingProduct
    ) {
      data.append(
        "removeImageIds",
        JSON.stringify(
          form.removeImageIds
        )
      );

      updateMutation.mutate({
        id:
          editingProduct.id,

        formData:
          data,
      });

      return;
    }

    createMutation.mutate(
      data
    );
  };

  const saving =
    createMutation.isPending ||
    updateMutation.isPending;

  return (
    <div>

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

        <div>

          <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#a86674]">
            Catalog
          </p>

          <h1 className="font-beauty mt-1 text-[30px] font-semibold text-[#45292f] sm:text-4xl dark:text-[#f5e8eb]">
            Products
          </h1>

          <p className="mt-1.5 text-[9px] text-[#92777d] sm:text-xs dark:text-[#a99297]">
            Manage your HoneyGlow products,
            pricing and stock.
          </p>
        </div>

        <button
          type="button"
          onClick={
            openCreateModal
          }
          className="inline-flex w-fit items-center gap-1.5 rounded-[10px] bg-[#793747] px-3.5 py-2.5 text-[8px] font-semibold text-white shadow-[0_7px_20px_rgba(121,55,71,0.16)] transition hover:bg-[#642d3a] sm:text-[9px]"
        >
          <Plus
            size={13}
          />

          Add Product
        </button>
      </div>

      {/* =================================================
          SEARCH
      ================================================= */}

      <div className="mb-4 flex flex-col gap-2.5 rounded-[15px] border border-[#e8dad7] bg-white p-2.5 dark:border-white/10 dark:bg-[#1b1518] sm:flex-row sm:items-center sm:justify-between">

        <div className="flex w-full max-w-[320px] items-center rounded-[10px] border border-[#e6d8d5] bg-[#fcf8f7] px-2.5 dark:border-white/10 dark:bg-[#120e10]">

          <Search
            size={13}
            className="shrink-0 text-[#9e747c]"
          />

          <input
            value={
              search
            }
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            placeholder="Search products..."
            className="w-full bg-transparent px-2.5 py-2.5 text-[9px] text-[#513c41] outline-none placeholder:text-[#b29ca1] sm:text-[10px] dark:text-white"
          />
        </div>

        <p className="text-[7px] font-semibold uppercase tracking-[0.14em] text-[#a1868c] sm:text-[8px]">
          {products.length} Products
        </p>
      </div>

      {/* =================================================
          PRODUCTS GRID

          MOBILE = EXACT 2 CARDS
      ================================================= */}

      {isLoading ? (
        <ProductSkeleton />
      ) : isError ? (
        <div className="rounded-[18px] border border-red-200 bg-red-50 p-7 text-center text-[10px] text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
          Unable to load products.
        </div>
      ) : filteredProducts.length ===
        0 ? (
        <div className="rounded-[20px] border border-dashed border-[#ddc7c3] bg-white px-5 py-12 text-center dark:border-white/10 dark:bg-[#1b1518]">

          <Package
            size={24}
            className="mx-auto text-[#a35a67]"
          />

          <h2 className="font-beauty mt-3 text-xl font-semibold text-[#503039] dark:text-[#f0dce1]">
            No products yet
          </h2>

          <p className="mt-1.5 text-[9px] text-[#9b8388]">
            Add your first HoneyGlow product.
          </p>
        </div>
      ) : (
        <div
          className="
            grid
            grid-cols-2
            gap-2

            sm:grid-cols-3
            sm:gap-2.5

            md:grid-cols-4

            xl:grid-cols-5

            2xl:grid-cols-6
          "
        >
          {filteredProducts.map(
            (product) => (
              <ProductCard
                key={
                  product.id
                }
                product={
                  product
                }
                onEdit={() =>
                  openEditModal(
                    product
                  )
                }
                onDelete={() =>
                  setDeleteTarget(
                    product
                  )
                }
              />
            )
          )}
        </div>
      )}

      {/* =================================================
          CREATE / EDIT MODAL
      ================================================= */}

      {modalOpen && (
        <ProductModal
          form={
            form
          }
          setForm={
            setForm
          }
          categories={
            categories
          }
          editing={Boolean(
            editingProduct
          )}
          saving={
            saving
          }
          error={
            createMutation.error
              ?.response?.data
              ?.message ||
            updateMutation.error
              ?.response?.data
              ?.message
          }
          onSubmit={
            handleSubmit
          }
          onClose={
            closeModal
          }
        />
      )}

      {/* =================================================
          DELETE MODAL
      ================================================= */}

      {deleteTarget && (
        <DeleteProductModal
          product={
            deleteTarget
          }
          deleting={
            deleteMutation.isPending
          }
          error={
            deleteMutation.error
              ?.response?.data
              ?.message
          }
          onCancel={() => {
            setDeleteTarget(
              null
            );

            deleteMutation.reset();
          }}
          onDelete={() =>
            deleteMutation.mutate(
              deleteTarget.id
            )
          }
        />
      )}
    </div>
  );
}

/* =====================================================
   PRODUCT CARD
===================================================== */

function ProductCard({
  product,
  onEdit,
  onDelete,
}) {
  const image =
    product.images?.[0]
      ?.imageUrl;

  const finalPrice =
    Number(
      product.discountPrice ??
        product.originalPrice
    );

  const hasDiscount =
    product.discountPrice &&
    Number(
      product.discountPrice
    ) <
      Number(
        product.originalPrice
      );

  const stock =
    Number(
      product.stock || 0
    );

  return (
    <article className="group min-w-0 overflow-hidden rounded-[12px] border border-[#e7d8d5] bg-white shadow-[0_3px_12px_rgba(71,42,48,0.035)] transition duration-300 hover:-translate-y-0.5 hover:border-[#d5b7b5] dark:border-white/10 dark:bg-[#1b1518]">

      {/* ================================================
          IMAGE
      ================================================ */}

      <div
        className="
          relative
          h-[84px]
          overflow-hidden
          bg-[#f3e5e1]

          min-[380px]:h-[92px]

          sm:h-[105px]

          lg:h-[110px]

          dark:bg-[#271d20]
        "
      >
        {image ? (
          <img
            src={
              image
            }
            alt={
              product.name
            }
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">

            <ImageIcon
              size={17}
              className="text-[#c29ba1]"
            />
          </div>
        )}

        {/* FEATURED */}

        {product.isFeatured && (
          <span
            className="
              absolute
              left-1
              top-1
              inline-flex
              items-center
              gap-0.5
              rounded-full
              bg-[#d7a44f]/95
              px-1.5
              py-0.5
              text-[5px]
              font-bold
              text-white

              sm:left-1.5
              sm:top-1.5
              sm:text-[6px]
            "
          >
            <Star
              size={6}
              fill="currentColor"
            />

            Featured
          </span>
        )}

        {/* HIDDEN */}

        {!product.isActive && (
          <span className="absolute bottom-1 left-1 rounded-full bg-black/65 px-1.5 py-0.5 text-[5px] font-bold text-white sm:bottom-1.5 sm:left-1.5">
            Hidden
          </span>
        )}

        {/* DISCOUNT */}

        {Number(
          product.discountPercent
        ) > 0 && (
          <span className="absolute right-1 top-1 rounded-full bg-[#873848] px-1.5 py-0.5 text-[5px] font-bold text-white sm:right-1.5 sm:top-1.5 sm:text-[6px]">

            {
              product.discountPercent
            }
            %
          </span>
        )}
      </div>

      {/* ================================================
          BODY
      ================================================ */}

      <div className="p-2 sm:p-2.5">

        {/* CATEGORY */}

        <p className="truncate text-[5px] font-bold uppercase tracking-[0.1em] text-[#a0747c] sm:text-[6px]">
          {product.category?.name ||
            "Uncategorized"}
        </p>

        {/* PRODUCT NAME */}

        <h2 className="font-beauty mt-0.5 truncate text-[12px] font-semibold leading-tight text-[#4d3037] sm:text-[14px] dark:text-[#f6e9eb]">
          {product.name}
        </h2>

        {/* PRICE */}

        <div className="mt-1 flex min-w-0 flex-wrap items-center gap-x-1 gap-y-0.5">

          <span className="whitespace-nowrap text-[8px] font-bold text-[#743744] sm:text-[9px] dark:text-[#efbdc7]">
            Rs.{" "}
            {finalPrice.toLocaleString()}
          </span>

          {hasDiscount && (
            <span className="truncate text-[5px] text-[#a98e94] line-through sm:text-[6px]">
              Rs.{" "}
              {Number(
                product.originalPrice
              ).toLocaleString()}
            </span>
          )}
        </div>

        {/* STOCK */}

        <div className="mt-1 flex items-center justify-between gap-1">

          <p className="truncate text-[6px] text-[#967d82] sm:text-[7px]">

            Stock:{" "}

            <strong className="text-[#65434a] dark:text-[#dbc4c9]">
              {product.stock}
            </strong>
          </p>

          <span
            className={`h-1.5 w-1.5 shrink-0 rounded-full ${
              stock > 5
                ? "bg-emerald-500"
                : stock > 0
                  ? "bg-amber-500"
                  : "bg-red-500"
            }`}
          />
        </div>

        {/* ==============================================
            ACTIONS
        ============================================== */}

        <div className="mt-1.5 flex gap-1 border-t border-[#eee2df] pt-1.5 sm:mt-2 sm:pt-2 dark:border-white/10">

          {/* EDIT */}

          <button
            type="button"
            onClick={
              onEdit
            }
            className="
              flex
              h-[24px]
              min-w-0
              flex-1
              items-center
              justify-center
              gap-1
              rounded-[7px]
              bg-[#f3e5e2]
              text-[6px]
              font-semibold
              text-[#7c3c49]
              transition
              hover:bg-[#ead3d0]

              sm:h-7
              sm:text-[7px]

              dark:bg-[#302126]
              dark:text-[#ddaab4]
            "
          >
            <Edit3
              size={8}
              className="shrink-0 sm:h-[9px] sm:w-[9px]"
            />

            <span>
              Edit
            </span>
          </button>

          {/* DELETE */}

          <button
            type="button"
            onClick={
              onDelete
            }
            aria-label="Delete product"
            title="Delete product"
            className="
              flex
              h-[24px]
              w-[24px]
              shrink-0
              items-center
              justify-center
              rounded-[7px]
              border
              border-red-100
              bg-red-50
              text-red-500
              transition
              hover:bg-red-500
              hover:text-white

              sm:h-7
              sm:w-7

              dark:border-red-500/20
              dark:bg-red-500/10
            "
          >
            <Trash2
              size={8}
              className="sm:h-[10px] sm:w-[10px]"
            />
          </button>
        </div>
      </div>
    </article>
  );
}

/* =====================================================
   PRODUCT MODAL
===================================================== */

function ProductModal({
  form,
  setForm,
  categories,
  editing,
  saving,
  error,
  onSubmit,
  onClose,
}) {
  const original =
    Number(
      form.originalPrice
    );

  const discount =
    Number(
      form.discountPrice
    );

  const discountPercent =
    original > 0 &&
    discount > 0 &&
    discount < original
      ? Math.round(
          ((original -
            discount) /
            original) *
            100
        )
      : 0;

  /* ===================================================
     EXISTING IMAGES
  =================================================== */

  const visibleExisting =
    form.existingImages.filter(
      (image) =>
        !form.removeImageIds.includes(
          image.id
        )
    );

  const totalImages =
    visibleExisting.length +
    form.newImages.length;

  /* ===================================================
     HANDLE IMAGES
  =================================================== */

  const handleImages = (
    e
  ) => {
    const files =
      Array.from(
        e.target.files ||
          []
      );

    if (
      !files.length
    ) {
      return;
    }

    if (
      totalImages +
        files.length >
      5
    ) {
      alert(
        "Maximum 5 images are allowed."
      );

      e.target.value =
        "";

      return;
    }

    const validFiles =
      files.filter(
        (file) =>
          [
            "image/jpeg",
            "image/png",
            "image/webp",
          ].includes(
            file.type
          ) &&
          file.size <=
            5 *
              1024 *
              1024
      );

    if (
      validFiles.length !==
      files.length
    ) {
      alert(
        "Only JPG, PNG or WEBP images under 5MB are allowed."
      );
    }

    const previews =
      validFiles.map(
        (file) =>
          URL.createObjectURL(
            file
          )
      );

    setForm(
      (previous) => ({
        ...previous,

        newImages: [
          ...previous.newImages,
          ...validFiles,
        ],

        newPreviews: [
          ...previous.newPreviews,
          ...previews,
        ],
      })
    );

    e.target.value =
      "";
  };

  /* ===================================================
     REMOVE NEW IMAGE
  =================================================== */

  const removeNewImage = (
    index
  ) => {
    URL.revokeObjectURL(
      form.newPreviews[
        index
      ]
    );

    setForm(
      (previous) => ({
        ...previous,

        newImages:
          previous.newImages.filter(
            (_, i) =>
              i !== index
          ),

        newPreviews:
          previous.newPreviews.filter(
            (_, i) =>
              i !== index
          ),
      })
    );
  };

  return (
    <div
      onClick={
        onClose
      }
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#2c1b20]/45 p-3 backdrop-blur-sm sm:p-4"
    >

      <div
        onClick={(e) =>
          e.stopPropagation()
        }
        className="max-h-[94vh] w-full max-w-[700px] overflow-y-auto rounded-[22px] bg-[#fffaf9] shadow-2xl dark:bg-[#191315]"
      >

        {/* =============================================
            HEADER
        ============================================= */}

        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#eadcd9] bg-[#fffaf9]/95 px-4 py-4 backdrop-blur-xl sm:px-5 dark:border-white/10 dark:bg-[#191315]/95">

          <div>

            <p className="text-[7px] font-bold uppercase tracking-[0.2em] text-[#a2606e] sm:text-[8px]">
              HoneyGlow Catalog
            </p>

            <h2 className="font-beauty mt-1 text-[24px] font-semibold text-[#4c2f36] sm:text-[28px] dark:text-[#f2e1e5]">
              {editing
                ? "Edit Product"
                : "New Product"}
            </h2>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#f2e4e1] text-[#75404a] sm:h-9 sm:w-9 dark:bg-[#302227] dark:text-white"
          >
            <X
              size={15}
            />
          </button>
        </div>

        {/* =============================================
            FORM
        ============================================= */}

        <form
          onSubmit={
            onSubmit
          }
          className="space-y-4 p-4 sm:space-y-5 sm:p-5"
        >

          {/* NAME + CATEGORY */}

          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">

            <FormField label="Product Name">

              <input
                required
                value={
                  form.name
                }
                onChange={(e) =>
                  setForm({
                    ...form,

                    name:
                      e.target.value,
                  })
                }
                className={
                  inputClass
                }
                placeholder="Product name"
              />
            </FormField>

            <FormField label="Category">

              <select
                required
                value={
                  form.categoryId
                }
                onChange={(e) =>
                  setForm({
                    ...form,

                    categoryId:
                      e.target.value,
                  })
                }
                className={
                  inputClass
                }
              >
                <option value="">
                  Select category
                </option>

                {categories.map(
                  (
                    category
                  ) => (
                    <option
                      key={
                        category.id
                      }
                      value={
                        category.id
                      }
                    >
                      {
                        category.name
                      }
                    </option>
                  )
                )}
              </select>
            </FormField>
          </div>

          {/* DESCRIPTION */}

          <FormField label="Short Description">

            <textarea
              rows="3"
              value={
                form.shortDescription
              }
              onChange={(e) =>
                setForm({
                  ...form,

                  shortDescription:
                    e.target.value,
                })
              }
              className={`${inputClass} resize-none`}
              placeholder="Short product description..."
            />
          </FormField>

          {/* PRICES */}

          <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">

            <FormField label="Original Price">

              <input
                required
                type="number"
                min="1"
                step="0.01"
                value={
                  form.originalPrice
                }
                onChange={(e) =>
                  setForm({
                    ...form,

                    originalPrice:
                      e.target.value,
                  })
                }
                className={
                  inputClass
                }
                placeholder="3000"
              />
            </FormField>

            <FormField label="Discount Price">

              <input
                type="number"
                min="0"
                step="0.01"
                value={
                  form.discountPrice
                }
                onChange={(e) =>
                  setForm({
                    ...form,

                    discountPrice:
                      e.target.value,
                  })
                }
                className={
                  inputClass
                }
                placeholder="2400"
              />
            </FormField>

            <FormField label="Discount">

              <div className="flex min-h-[38px] items-center justify-center rounded-[10px] bg-[#f3e2df] text-[10px] font-bold text-[#873848] sm:min-h-[40px] sm:text-[12px] dark:bg-[#322126] dark:text-[#e6a8b5]">

                {
                  discountPercent
                }
                % OFF
              </div>
            </FormField>
          </div>

          {/* STOCK + SKU */}

          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">

            <FormField label="Stock">

              <input
                required
                type="number"
                min="0"
                value={
                  form.stock
                }
                onChange={(e) =>
                  setForm({
                    ...form,

                    stock:
                      e.target.value,
                  })
                }
                className={
                  inputClass
                }
                placeholder="20"
              />
            </FormField>

            <FormField label="SKU">

              <input
                value={
                  form.sku
                }
                onChange={(e) =>
                  setForm({
                    ...form,

                    sku:
                      e.target.value,
                  })
                }
                className={
                  inputClass
                }
                placeholder="Optional"
              />
            </FormField>
          </div>

          {/* CURRENT IMAGES */}

          {visibleExisting.length >
            0 && (
            <FormField label="Current Images">

              <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 sm:gap-3">

                {visibleExisting.map(
                  (
                    image
                  ) => (
                    <div
                      key={
                        image.id
                      }
                      className="relative aspect-square overflow-hidden rounded-[9px] border border-[#e8d9d6] sm:rounded-xl"
                    >
                      <img
                        src={
                          image.imageUrl
                        }
                        alt=""
                        className="h-full w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setForm(
                            (
                              previous
                            ) => ({
                              ...previous,

                              removeImageIds:
                                [
                                  ...previous.removeImageIds,
                                  image.id,
                                ],
                            })
                          )
                        }
                        className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/65 text-white transition hover:bg-red-500 sm:h-6 sm:w-6"
                      >
                        <X
                          size={10}
                        />
                      </button>
                    </div>
                  )
                )}
              </div>
            </FormField>
          )}

          {/* NEW IMAGES */}

          <FormField
            label={`Product Images (${totalImages}/5)`}
          >

            <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 sm:gap-3">

              {form.newPreviews.map(
                (
                  preview,
                  index
                ) => (
                  <div
                    key={
                      preview
                    }
                    className="relative aspect-square overflow-hidden rounded-[9px] border border-[#e8d9d6] sm:rounded-xl"
                  >
                    <img
                      src={
                        preview
                      }
                      alt=""
                      className="h-full w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeNewImage(
                          index
                        )
                      }
                      className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/65 text-white transition hover:bg-red-500 sm:h-6 sm:w-6"
                    >
                      <X
                        size={10}
                      />
                    </button>
                  </div>
                )
              )}

              {totalImages <
                5 && (
                <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-[9px] border-2 border-dashed border-[#d9c1be] bg-[#faf3f1] text-[#8c5360] transition hover:border-[#ad707a] sm:rounded-xl dark:border-white/10 dark:bg-[#120e10]">

                  <Upload
                    size={15}
                  />

                  <span className="mt-1 text-[5px] font-semibold sm:text-[7px]">
                    Add Image
                  </span>

                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    onChange={
                      handleImages
                    }
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <p className="mt-1.5 text-[7px] text-[#a38b90] sm:text-[8px]">
              Up to 5 images · JPG,
              PNG or WEBP · Max 5MB each.
            </p>
          </FormField>

          {/* TOGGLES */}

          <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">

            <ToggleBox
              title="Active"
              subtitle="Show product on website"
              checked={
                form.isActive
              }
              onChange={(
                checked
              ) =>
                setForm({
                  ...form,

                  isActive:
                    checked,
                })
              }
            />

            <ToggleBox
              title="Featured"
              subtitle="Show in featured section"
              checked={
                form.isFeatured
              }
              onChange={(
                checked
              ) =>
                setForm({
                  ...form,

                  isFeatured:
                    checked,
                })
              }
            />
          </div>

          {/* ERROR */}

          {error && (
            <div className="rounded-[10px] bg-red-50 px-3 py-2.5 text-[9px] text-red-600 dark:bg-red-500/10 dark:text-red-300">
              {error}
            </div>
          )}

          {/* BUTTONS */}

          <div className="flex justify-end gap-2 border-t border-[#eadcd9] pt-4 dark:border-white/10">

            <button
              type="button"
              onClick={
                onClose
              }
              disabled={
                saving
              }
              className="rounded-[10px] border border-[#dfcfcc] px-4 py-2.5 text-[8px] font-semibold text-[#71545a] disabled:opacity-50 sm:px-5 sm:text-[9px] dark:border-white/10 dark:text-[#d6c0c5]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                saving ||
                !form.name.trim() ||
                !form.categoryId ||
                !form.originalPrice ||
                totalImages <
                  1
              }
              className="rounded-[10px] bg-[#793747] px-4 py-2.5 text-[8px] font-semibold text-white transition hover:bg-[#622c39] disabled:cursor-not-allowed disabled:opacity-50 sm:px-6 sm:text-[9px]"
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
   DELETE PRODUCT MODAL
===================================================== */

function DeleteProductModal({
  product,
  deleting,
  error,
  onCancel,
  onDelete,
}) {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">

      <div className="w-full max-w-[370px] rounded-[20px] border border-[#ead8d5] bg-white p-5 shadow-2xl dark:border-white/10 dark:bg-[#1b1518]">

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-500 dark:bg-red-500/10">

          <Trash2
            size={15}
          />
        </div>

        <p className="mt-3 text-[7px] font-bold uppercase tracking-[0.15em] text-red-500">
          Delete Product
        </p>

        <h2 className="font-beauty mt-1 text-[24px] font-semibold text-[#4d3037] dark:text-[#f3e4e7]">
          Delete product?
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
            onClick={
              onCancel
            }
            disabled={
              deleting
            }
            className="rounded-[9px] border border-[#decac7] px-3.5 py-2.5 text-[8px] font-semibold text-[#72565c] disabled:opacity-50 dark:border-white/10 dark:text-[#cfb9be]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={
              onDelete
            }
            disabled={
              deleting
            }
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

/* =====================================================
   TOGGLE
===================================================== */

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
        checked={
          checked
        }
        onChange={(e) =>
          onChange(
            e.target.checked
          )
        }
        className="ml-2 h-3.5 w-3.5 shrink-0 accent-[#793747]"
      />
    </label>
  );
}

/* =====================================================
   FORM FIELD
===================================================== */

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

/* =====================================================
   SKELETON
===================================================== */

function ProductSkeleton() {
  return (
    <div
      className="
        grid
        grid-cols-2
        gap-2

        sm:grid-cols-3
        sm:gap-2.5

        md:grid-cols-4

        xl:grid-cols-5

        2xl:grid-cols-6
      "
    >
      {Array.from({
        length: 12,
      }).map(
        (_, index) => (
          <div
            key={
              index
            }
            className="animate-pulse overflow-hidden rounded-[12px] border border-[#e9dbd8] bg-white dark:border-white/10 dark:bg-[#1b1518]"
          >

            <div className="h-[84px] bg-[#f0dfdc] min-[380px]:h-[92px] sm:h-[105px] lg:h-[110px] dark:bg-[#2a2023]" />

            <div className="space-y-1.5 p-2 sm:p-2.5">

              <div className="h-1.5 w-10 rounded bg-[#eee2df] dark:bg-white/5" />

              <div className="h-3 w-2/3 rounded bg-[#eee2df] dark:bg-white/5" />

              <div className="h-2 w-14 rounded bg-[#eee2df] dark:bg-white/5" />

              <div className="h-6 w-full rounded-[7px] bg-[#f0e2df] dark:bg-white/5" />
            </div>
          </div>
        )
      )}
    </div>
  );
}

/* =====================================================
   INPUT CLASS
===================================================== */

const inputClass =
  "w-full rounded-[10px] border border-[#e3d4d1] bg-white px-3 py-2.5 text-[9px] text-[#513b40] outline-none transition placeholder:text-[#b9a3a7] focus:border-[#a55b69] sm:text-[10px] dark:border-white/10 dark:bg-[#120e10] dark:text-white";

export default AdminProducts;
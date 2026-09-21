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
  Plus,
  Search,
  Star,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import {
  createCategory,
  deleteCategory,
  getAdminCategories,
  updateCategory,
} from "../services/categoryApi";

/* =====================================================
   INITIAL FORM
===================================================== */

const initialForm = {
  name: "",
  shortDescription: "",

  image: null,
  imagePreview: "",

  displayOrder: 0,

  isActive: true,
  isFeatured: false,
};

/* =====================================================
   ADMIN CATEGORIES
===================================================== */

function AdminCategories() {
  const queryClient =
    useQueryClient();

  const [search, setSearch] =
    useState("");

  const [
    modalOpen,
    setModalOpen,
  ] = useState(false);

  const [
    editingCategory,
    setEditingCategory,
  ] = useState(null);

  const [
    deleteTarget,
    setDeleteTarget,
  ] = useState(null);

  const [form, setForm] =
    useState(initialForm);

  /* ===================================================
     GET CATEGORIES
  =================================================== */

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "admin-categories",
    ],

    queryFn:
      getAdminCategories,
  });

  const categories =
    Array.isArray(data)
      ? data
      : [];

  /* ===================================================
     CREATE
  =================================================== */

  const createMutation =
    useMutation({
      mutationFn:
        createCategory,

      onSuccess: async () => {
        await refreshCategories();

        closeModal();
      },
    });

  /* ===================================================
     UPDATE
  =================================================== */

  const updateMutation =
    useMutation({
      mutationFn:
        updateCategory,

      onSuccess: async () => {
        await refreshCategories();

        closeModal();
      },
    });

  /* ===================================================
     DELETE
  =================================================== */

  const deleteMutation =
    useMutation({
      mutationFn:
        deleteCategory,

      onSuccess: async () => {
        await refreshCategories();

        setDeleteTarget(
          null
        );
      },
    });

  /* ===================================================
     REFRESH
  =================================================== */

  async function refreshCategories() {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: [
          "admin-categories",
        ],
      }),

      queryClient.invalidateQueries({
        queryKey: [
          "categories",
        ],
      }),
    ]);
  }

  /* ===================================================
     SEARCH
  =================================================== */

  const filteredCategories =
    useMemo(() => {
      const keyword =
        search
          .trim()
          .toLowerCase();

      if (!keyword) {
        return categories;
      }

      return categories.filter(
        (category) =>
          category.name
            ?.toLowerCase()
            .includes(
              keyword
            )
      );
    }, [
      categories,
      search,
    ]);

  /* ===================================================
     OPEN CREATE
  =================================================== */

  const openCreateModal =
    () => {
      setEditingCategory(
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
     OPEN EDIT
  =================================================== */

  const openEditModal = (
    category
  ) => {
    setEditingCategory(
      category
    );

    setForm({
      name:
        category.name ||
        "",

      shortDescription:
        category.shortDescription ||
        "",

      image:
        null,

      imagePreview:
        category.imageUrl ||
        "",

      displayOrder:
        category.displayOrder ??
        0,

      isActive:
        category.isActive ??
        true,

      isFeatured:
        category.isFeatured ??
        false,
    });

    setModalOpen(
      true
    );
  };

  /* ===================================================
     CLOSE MODAL
  =================================================== */

  const closeModal = () => {
    if (
      form.image &&
      form.imagePreview?.startsWith(
        "blob:"
      )
    ) {
      URL.revokeObjectURL(
        form.imagePreview
      );
    }

    setModalOpen(
      false
    );

    setEditingCategory(
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

    const formData =
      new FormData();

    formData.append(
      "name",
      form.name.trim()
    );

    formData.append(
      "shortDescription",
      form.shortDescription.trim()
    );

    formData.append(
      "displayOrder",
      String(
        form.displayOrder
      )
    );

    formData.append(
      "isActive",
      String(
        form.isActive
      )
    );

    formData.append(
      "isFeatured",
      String(
        form.isFeatured
      )
    );

    if (form.image) {
      formData.append(
        "image",
        form.image
      );
    }

    /* EDIT */

    if (
      editingCategory
    ) {
      updateMutation.mutate({
        id:
          editingCategory.id,

        formData,
      });

      return;
    }

    /* CREATE */

    createMutation.mutate(
      formData
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
            Categories
          </h1>

          <p className="mt-1.5 text-[9px] text-[#92777d] sm:text-xs dark:text-[#a99297]">
            Organize the care collections shown
            across HoneyGlow.
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

          Add Category
        </button>
      </div>

      {/* =================================================
          SEARCH
      ================================================= */}

      <div className="mb-4 flex flex-col gap-2.5 rounded-[15px] border border-[#e8dad7] bg-white p-2.5 dark:border-white/10 dark:bg-[#1b1518] sm:flex-row sm:items-center sm:justify-between">

        <div className="flex w-full max-w-[320px] items-center rounded-[10px] border border-[#e6d8d5] bg-[#fcf8f7] px-2.5 transition focus-within:border-[#a75b69] dark:border-white/10 dark:bg-[#120e10]">

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
            placeholder="Search categories..."
            className="w-full bg-transparent px-2.5 py-2.5 text-[9px] text-[#513c41] outline-none placeholder:text-[#b29ca1] sm:text-[10px] dark:text-white"
          />
        </div>

        <p className="text-[7px] font-semibold uppercase tracking-[0.14em] text-[#a1868c] sm:text-[8px]">
          {categories.length} Categories
        </p>
      </div>

      {/* =================================================
          CATEGORY CONTENT
      ================================================= */}

      {isLoading ? (
        <CategorySkeleton />
      ) : isError ? (
        <div className="rounded-[18px] border border-red-200 bg-red-50 p-7 text-center text-[10px] text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
          Unable to load categories.
        </div>
      ) : filteredCategories.length ===
        0 ? (
        <div className="rounded-[20px] border border-dashed border-[#ddc7c3] bg-white px-5 py-12 text-center dark:border-white/10 dark:bg-[#1b1518]">

          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#f2e4e1] text-[#914a59] dark:bg-[#342126]">

            <ImageIcon
              size={17}
            />
          </div>

          <h2 className="font-beauty mt-3 text-xl font-semibold text-[#503039] dark:text-[#f0dce1]">
            No categories yet
          </h2>

          <p className="mt-1.5 text-[9px] text-[#9b8388]">
            Create your first HoneyGlow category.
          </p>

          {!search && (
            <button
              type="button"
              onClick={
                openCreateModal
              }
              className="mt-4 inline-flex items-center gap-1.5 rounded-[9px] bg-[#793747] px-3.5 py-2.5 text-[8px] font-semibold text-white"
            >
              <Plus
                size={12}
              />

              Create Category
            </button>
          )}
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
          {filteredCategories.map(
            (category) => (
              <CategoryCard
                key={
                  category.id
                }
                category={
                  category
                }
                onEdit={() =>
                  openEditModal(
                    category
                  )
                }
                onDelete={() =>
                  setDeleteTarget(
                    category
                  )
                }
              />
            )
          )}
        </div>
      )}

      {/* =================================================
          ADD / EDIT MODAL
      ================================================= */}

      {modalOpen && (
        <CategoryModal
          form={
            form
          }
          setForm={
            setForm
          }
          editing={Boolean(
            editingCategory
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
          onClose={
            closeModal
          }
          onSubmit={
            handleSubmit
          }
        />
      )}

      {/* =================================================
          DELETE MODAL
      ================================================= */}

      {deleteTarget && (
        <DeleteModal
          category={
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
   CATEGORY CARD
===================================================== */

function CategoryCard({
  category,
  onEdit,
  onDelete,
}) {
  return (
    <article className="group min-w-0 overflow-hidden rounded-[12px] border border-[#e7d8d5] bg-white shadow-[0_3px_12px_rgba(71,42,48,0.035)] transition duration-300 hover:-translate-y-0.5 hover:border-[#d5b7b5] dark:border-white/10 dark:bg-[#1b1518]">

      {/* ================================================
          IMAGE
      ================================================ */}

      <div
        className="
          relative
          h-[82px]
          overflow-hidden
          bg-[#f3e5e1]

          min-[380px]:h-[90px]

          sm:h-[103px]

          lg:h-[108px]

          dark:bg-[#271d20]
        "
      >
        {category.imageUrl ? (
          <img
            src={
              category.imageUrl
            }
            alt={
              category.name
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

        {/* ACTIVE / HIDDEN */}

        <div className="absolute left-1 top-1">

          <StatusBadge
            active={
              category.isActive
            }
          />
        </div>

        {/* FEATURED */}

        {category.isFeatured && (
          <span className="absolute right-1 top-1 inline-flex items-center gap-0.5 rounded-full bg-[#d7a44f]/95 px-1.5 py-0.5 text-[5px] font-bold text-white sm:right-1.5 sm:top-1.5 sm:text-[6px]">

            <Star
              size={6}
              fill="currentColor"
            />

            <span className="hidden min-[390px]:inline">
              Featured
            </span>
          </span>
        )}
      </div>

      {/* ================================================
          BODY
      ================================================ */}

      <div className="p-2 sm:p-2.5">

        {/* TOP */}

        <div className="flex min-w-0 items-start justify-between gap-1">

          <div className="min-w-0 flex-1">

            <h2 className="font-beauty truncate text-[12px] font-semibold leading-tight text-[#4d3037] sm:text-[14px] dark:text-[#f6e9eb]">
              {category.name}
            </h2>

            <p className="mt-0.5 truncate text-[5px] text-[#a1878d] sm:text-[6px]">
              /{category.slug}
            </p>
          </div>

          <span className="shrink-0 rounded-[5px] bg-[#f4e8e5] px-1.5 py-0.5 text-[5px] font-bold text-[#8d5661] sm:text-[6px] dark:bg-[#322227] dark:text-[#dbabb5]">
            #{category.displayOrder}
          </span>
        </div>

        {/* DESCRIPTION */}

        <p className="mt-1 line-clamp-2 min-h-[22px] text-[6px] leading-[11px] text-[#8e7479] sm:min-h-[28px] sm:text-[7px] sm:leading-[14px] dark:text-[#aa9499]">
          {category.shortDescription ||
            "No description added yet."}
        </p>

        {/* ACTIONS */}

        <div className="mt-1.5 flex gap-1 border-t border-[#eee2df] pt-1.5 sm:mt-2 sm:pt-2 dark:border-white/10">

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
              hover:bg-[#ead6d2]

              sm:h-7
              sm:text-[7px]

              dark:bg-[#302126]
              dark:text-[#ddaab4]
            "
          >
            <Edit3
              size={8}
            />

            Edit
          </button>

          <button
            type="button"
            onClick={
              onDelete
            }
            aria-label={`Delete ${category.name}`}
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
            />
          </button>
        </div>
      </div>
    </article>
  );
}

/* =====================================================
   CATEGORY MODAL
===================================================== */

function CategoryModal({
  form,
  setForm,
  editing,
  saving,
  error,
  onClose,
  onSubmit,
}) {
  /* ===================================================
     IMAGE CHANGE
  =================================================== */

  const handleImageChange = (
    e
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      alert(
        "Only JPG, PNG and WEBP images are allowed."
      );

      e.target.value =
        "";

      return;
    }

    if (
      file.size >
      5 *
        1024 *
        1024
    ) {
      alert(
        "Image size must be less than 5MB."
      );

      e.target.value =
        "";

      return;
    }

    if (
      form.image &&
      form.imagePreview?.startsWith(
        "blob:"
      )
    ) {
      URL.revokeObjectURL(
        form.imagePreview
      );
    }

    const preview =
      URL.createObjectURL(
        file
      );

    setForm(
      (previous) => ({
        ...previous,

        image:
          file,

        imagePreview:
          preview,
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
        className="max-h-[94vh] w-full max-w-[550px] overflow-y-auto rounded-[22px] border border-white/40 bg-[#fffaf9] shadow-[0_25px_80px_rgba(42,25,29,0.25)] dark:border-white/10 dark:bg-[#191315]"
      >

        {/* HEADER */}

        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#eadcd9] bg-[#fffaf9]/95 px-4 py-4 backdrop-blur-xl sm:px-5 dark:border-white/10 dark:bg-[#191315]/95">

          <div>

            <p className="text-[7px] font-bold uppercase tracking-[0.2em] text-[#a2606e] sm:text-[8px]">
              HoneyGlow Catalog
            </p>

            <h2 className="font-beauty mt-1 text-[24px] font-semibold text-[#4b2c33] sm:text-[28px] dark:text-[#f5e7ea]">
              {editing
                ? "Edit Category"
                : "New Category"}
            </h2>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#f2e4e1] text-[#77404b] transition hover:bg-[#e9d5d1] sm:h-9 sm:w-9 dark:bg-[#302227]"
          >
            <X
              size={15}
            />
          </button>
        </div>

        {/* FORM */}

        <form
          onSubmit={
            onSubmit
          }
          className="space-y-4 p-4 sm:space-y-5 sm:p-5"
        >

          {/* NAME */}

          <FormField label="Category Name">

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
              placeholder="e.g. Skincare"
              className={
                inputClass
              }
            />
          </FormField>

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
              placeholder="Short category description..."
              className={`${inputClass} resize-none`}
            />
          </FormField>

          {/* IMAGE */}

          <FormField label="Category Image">

            <label className="group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[14px] border-2 border-dashed border-[#dfc9c6] bg-[#faf3f1] transition duration-300 hover:border-[#a75b69] dark:border-white/10 dark:bg-[#120e10]">

              {form.imagePreview ? (
                <div className="relative w-full">

                  <img
                    src={
                      form.imagePreview
                    }
                    alt="Category preview"
                    className="h-[125px] w-full object-cover sm:h-[155px]"
                  />

                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition duration-300 group-hover:bg-black/30">

                    <span className="flex translate-y-2 items-center gap-1.5 rounded-full bg-white/90 px-3 py-2 text-[7px] font-semibold text-[#6d3843] opacity-0 shadow-lg transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:text-[8px]">

                      <Upload
                        size={11}
                      />

                      Change Image
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[125px] flex-col items-center justify-center px-5 py-6 text-center sm:min-h-[155px]">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#efdcda] text-[#8e4654] sm:h-10 sm:w-10 dark:bg-[#342226]">

                    <Upload
                      size={16}
                    />
                  </div>

                  <p className="mt-3 text-[9px] font-semibold text-[#583b42] sm:text-[10px] dark:text-[#eee0e3]">
                    Select image from computer
                  </p>

                  <p className="mt-1 text-[7px] text-[#a38b90]">
                    JPG, PNG or WEBP · Max 5MB
                  </p>
                </div>
              )}

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={
                  handleImageChange
                }
                className="hidden"
              />
            </label>

            {form.image && (
              <div className="mt-2 flex items-center justify-between rounded-[10px] bg-[#f4e7e4] px-3 py-2 dark:bg-[#2b1e22]">

                <div className="min-w-0">

                  <p className="truncate text-[8px] font-semibold text-[#71414b] dark:text-[#e0bbc3]">
                    {
                      form.image.name
                    }
                  </p>

                  <p className="mt-0.5 text-[6px] text-[#9c7f84]">
                    {(
                      form.image.size /
                      1024 /
                      1024
                    ).toFixed(
                      2
                    )}{" "}
                    MB
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (
                      form.imagePreview?.startsWith(
                        "blob:"
                      )
                    ) {
                      URL.revokeObjectURL(
                        form.imagePreview
                      );
                    }

                    setForm(
                      (
                        previous
                      ) => ({
                        ...previous,

                        image:
                          null,

                        imagePreview:
                          editing
                            ? editing &&
                              previous
                                .imagePreview
                            : "",
                      })
                    );
                  }}
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[#90525f] hover:bg-white/50"
                >
                  <X
                    size={11}
                  />
                </button>
              </div>
            )}
          </FormField>

          {/* ORDER */}

          <FormField label="Display Order">

            <input
              type="number"
              min="0"
              value={
                form.displayOrder
              }
              onChange={(e) =>
                setForm({
                  ...form,

                  displayOrder:
                    e.target.value,
                })
              }
              className={
                inputClass
              }
            />

            <p className="mt-1 text-[7px] text-[#ad9297]">
              Smaller numbers appear first.
            </p>
          </FormField>

          {/* TOGGLES */}

          <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">

            <ToggleBox
              title="Active"
              subtitle="Show on website"
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
              subtitle="Highlight category"
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
            <div className="rounded-[10px] border border-red-100 bg-red-50 px-3 py-2.5 text-[9px] text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
              {error}
            </div>
          )}

          {/* ACTIONS */}

          <div className="flex justify-end gap-2 border-t border-[#eadcd9] pt-4 dark:border-white/10">

            <button
              type="button"
              onClick={
                onClose
              }
              disabled={
                saving
              }
              className="rounded-[10px] border border-[#dfcfcc] px-4 py-2.5 text-[8px] font-semibold text-[#775e63] disabled:opacity-50 sm:px-5 sm:text-[9px] dark:border-white/10 dark:text-[#bea9ae]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                saving ||
                !form.name.trim()
              }
              className="rounded-[10px] bg-[#793747] px-4 py-2.5 text-[8px] font-semibold text-white shadow-[0_7px_18px_rgba(121,55,71,0.14)] transition hover:bg-[#642d3a] disabled:cursor-not-allowed disabled:opacity-60 sm:px-6 sm:text-[9px]"
            >
              {saving
                ? "Saving..."
                : editing
                  ? "Save Changes"
                  : "Create Category"}
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
  category,
  deleting,
  error,
  onCancel,
  onDelete,
}) {
  return (
    <div
      onClick={
        onCancel
      }
      className="fixed inset-0 z-[110] flex items-center justify-center bg-[#2c1b20]/50 p-4 backdrop-blur-sm"
    >

      <div
        onClick={(e) =>
          e.stopPropagation()
        }
        className="w-full max-w-[370px] rounded-[20px] border border-[#ead8d5] bg-white p-5 shadow-2xl dark:border-white/10 dark:bg-[#1b1518]"
      >

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-500 dark:bg-red-500/10">

          <Trash2
            size={15}
          />
        </div>

        <p className="mt-3 text-[7px] font-bold uppercase tracking-[0.15em] text-red-500">
          Delete Category
        </p>

        <h2 className="font-beauty mt-1 text-[24px] font-semibold text-[#4d3037] dark:text-[#f3e4e7]">
          Delete category?
        </h2>

        <p className="mt-2 text-[9px] leading-5 text-[#8e757a] dark:text-[#ad969b]">

          You're about to delete{" "}

          <strong className="text-[#624047] dark:text-[#e3cbd0]">
            {category.name}
          </strong>

          . This action cannot be undone.
        </p>

        {error && (
          <p className="mt-3 rounded-[10px] bg-red-50 p-2.5 text-[8px] text-red-600 dark:bg-red-500/10 dark:text-red-300">
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
            className="rounded-[9px] border border-[#e1d2cf] px-3.5 py-2.5 text-[8px] font-semibold disabled:opacity-50 dark:border-white/10"
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
            className="rounded-[9px] bg-red-500 px-3.5 py-2.5 text-[8px] font-semibold text-white transition hover:bg-red-600 disabled:opacity-60"
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
   STATUS BADGE
===================================================== */

function StatusBadge({
  active,
}) {
  return (
    <span
      className={`rounded-full px-1.5 py-0.5 text-[5px] font-bold uppercase tracking-[0.06em] backdrop-blur-md sm:text-[6px] ${
        active
          ? "bg-emerald-500/90 text-white"
          : "bg-neutral-700/80 text-white"
      }`}
    >
      {active
        ? "Active"
        : "Hidden"}
    </span>
  );
}

/* =====================================================
   TOGGLE BOX
===================================================== */

function ToggleBox({
  title,
  subtitle,
  checked,
  onChange,
}) {
  return (
    <div className="flex items-center justify-between rounded-[13px] border border-[#e5d6d3] bg-white p-3 transition hover:border-[#cfa9a4] dark:border-white/10 dark:bg-[#120e10]">

      <div className="min-w-0">

        <p className="text-[9px] font-semibold text-[#583b42] dark:text-[#e8d6da]">
          {title}
        </p>

        <p className="mt-0.5 truncate text-[7px] text-[#a18b90]">
          {subtitle}
        </p>
      </div>

      <button
        type="button"
        onClick={() =>
          onChange(
            !checked
          )
        }
        className={`relative ml-2 h-5 w-9 shrink-0 rounded-full transition ${
          checked
            ? "bg-[#793747]"
            : "bg-[#d9cbca] dark:bg-[#413438]"
        }`}
      >
        <span
          className={`absolute top-1 h-3 w-3 rounded-full bg-white shadow-sm transition-all ${
            checked
              ? "left-5"
              : "left-1"
          }`}
        />
      </button>
    </div>
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
   CATEGORY SKELETON
===================================================== */

function CategorySkeleton() {
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
            className="animate-pulse overflow-hidden rounded-[12px] border border-[#eadedb] bg-white dark:border-white/10 dark:bg-[#1b1518]"
          >

            <div className="h-[82px] bg-[#f0dfdc] min-[380px]:h-[90px] sm:h-[103px] lg:h-[108px] dark:bg-[#2a2023]" />

            <div className="space-y-1.5 p-2 sm:p-2.5">

              <div className="h-3 w-2/3 rounded bg-[#eee2df] dark:bg-[#302629]" />

              <div className="h-1.5 w-1/3 rounded bg-[#eee2df] dark:bg-[#302629]" />

              <div className="h-2 w-full rounded bg-[#f1e7e4] dark:bg-[#302629]" />

              <div className="h-6 rounded-[7px] bg-[#f1e7e4] dark:bg-[#302629]" />
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

export default AdminCategories;
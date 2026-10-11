import {
  useEffect,
  useState,
} from "react";

import {
  Clock3,
  MapPin,
  Save,
  Settings,
  ShieldCheck,
  Truck,
  Zap,
  X,
} from "lucide-react";

import {
  getDeliverySettings,
  updateDeliverySettings,
} from "../services/settingsApi";

const DEFAULT_SETTINGS = {
  enabled: true,

  standard: {
    enabled: true,
    charge: 200,
    estimatedDays: 5,
  },

  express: {
    enabled: true,
    charge: 350,
    estimatedDays: 2,
  },

  overnight: {
    enabled: false,
    charge: 500,
    estimatedDays: 1,
  },

  urgent: {
    enabled: false,
    charge: 300,
    estimatedHoursMin: 1,
    estimatedHoursMax: 2,
    cities: ["lahore"],
  },

  freeDeliveryEnabled: false,
  freeDeliveryThreshold: 5000,
};

function AdminSettings() {
  const [settings, setSettings] =
    useState(DEFAULT_SETTINGS);

  const [cityInput, setCityInput] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getDeliverySettings();

      setSettings({
        ...DEFAULT_SETTINGS,
        ...data,

        standard: {
          ...DEFAULT_SETTINGS.standard,
          ...data?.standard,
        },

        express: {
          ...DEFAULT_SETTINGS.express,
          ...data?.express,
        },

        overnight: {
          ...DEFAULT_SETTINGS.overnight,
          ...data?.overnight,
        },

        urgent: {
          ...DEFAULT_SETTINGS.urgent,
          ...data?.urgent,

          cities: Array.isArray(
            data?.urgent?.cities
          )
            ? data.urgent.cities
            : [],
        },
      });
    } catch (err) {
      console.error(
        "Load settings error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load delivery settings."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateMethod = (
    method,
    field,
    value
  ) => {
    setSettings((current) => ({
      ...current,

      [method]: {
        ...current[method],
        [field]: value,
      },
    }));
  };

  const addCity = () => {
    const city = cityInput
      .trim()
      .toLowerCase();

    if (!city) return;

    const alreadyExists =
      settings.urgent.cities.some(
        (item) =>
          item.toLowerCase() === city
      );

    if (alreadyExists) {
      setError(
        "This city is already added."
      );

      return;
    }

    setSettings((current) => ({
      ...current,

      urgent: {
        ...current.urgent,

        cities: [
          ...current.urgent.cities,
          city,
        ],
      },
    }));

    setCityInput("");
    setError("");
  };

  const removeCity = (city) => {
    setSettings((current) => ({
      ...current,

      urgent: {
        ...current.urgent,

        cities:
          current.urgent.cities.filter(
            (item) => item !== city
          ),
      },
    }));
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response =
        await updateDeliverySettings(
          settings
        );

      if (response?.delivery) {
        setSettings(
          response.delivery
        );
      }

      setMessage(
        response?.message ||
          "Delivery settings updated successfully."
      );

      setTimeout(() => {
        setMessage("");
      }, 3500);
    } catch (err) {
      console.error(
        "Save settings error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to save delivery settings."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div
        className="
          min-h-screen
          bg-[#fffaf8]
          p-4
          transition-colors
          sm:p-6
          lg:p-8

          dark:bg-[#111012]
        "
      >
        <div className="mx-auto max-w-[1450px]">

          <div
            className="
              h-8
              w-64
              animate-pulse
              rounded-xl
              bg-[#eee2e3]

              dark:bg-[#292429]
            "
          />

          <div
            className="
              mt-8
              grid
              gap-5
              lg:grid-cols-3
            "
          >
            {Array.from({
              length: 3,
            }).map((_, index) => (
              <div
                key={index}
                className="
                  h-[220px]
                  animate-pulse
                  rounded-[24px]
                  bg-[#f1e6e7]

                  dark:bg-[#211d21]
                "
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        min-h-screen
        bg-[#fffaf8]
        p-4
        text-[#50343b]
        transition-colors
        sm:p-6
        lg:p-8

        dark:bg-[#111012]
        dark:text-[#f5e9ec]
      "
    >
      <div className="mx-auto max-w-[1450px]">

        {/* HEADER */}

        <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <div className="flex items-center gap-2">

              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#f4e5e8]
                  text-[#793044]

                  dark:bg-[#38242c]
                  dark:text-[#e59aae]
                "
              >
                <Settings size={17} />
              </div>

              <p
                className="
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-[0.22em]
                  text-[#9a5f6e]

                  dark:text-[#ce8799]
                "
              >
                KM Cares Admin
              </p>
            </div>

            <h1
              className="
                font-beauty
                mt-3
                text-[32px]
                font-semibold
                tracking-[-0.035em]
                text-[#50343b]
                sm:text-[38px]

                dark:text-[#f8ecef]
              "
            >
              Delivery Settings
            </h1>

            <p
              className="
                mt-1
                max-w-[600px]
                text-[10px]
                leading-5
                text-[#9a858a]

                dark:text-[#aa9da1]
              "
            >
              Manage delivery methods,
              charges, delivery time and
              free delivery rules from one
              place.
            </p>
          </div>

          <SaveButton
            saving={saving}
            onClick={saveSettings}
          />
        </div>

        {/* ALERT */}

        {message && (
          <div
            className="
              mb-5
              rounded-[16px]
              border
              border-emerald-200
              bg-emerald-50
              px-4
              py-3
              text-[9px]
              text-emerald-700

              dark:border-emerald-900/60
              dark:bg-emerald-950/40
              dark:text-emerald-400
            "
          >
            {message}
          </div>
        )}

        {error && (
          <div
            className="
              mb-5
              flex
              items-center
              justify-between
              gap-3
              rounded-[16px]
              border
              border-red-200
              bg-red-50
              px-4
              py-3

              dark:border-red-900/60
              dark:bg-red-950/30
            "
          >
            <p
              className="
                text-[9px]
                text-red-600

                dark:text-red-400
              "
            >
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                setError("")
              }
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* MASTER */}

        <SectionCard>
          <div className="flex items-center justify-between gap-4">

            <SectionTitle
              icon={<Truck size={20} />}
              title="Delivery Service"
              description="Turn all store delivery services on or off."
            />

            <Toggle
              value={settings.enabled}
              onChange={() =>
                setSettings(
                  (current) => ({
                    ...current,

                    enabled:
                      !current.enabled,
                  })
                )
              }
            />
          </div>
        </SectionCard>

        {/* METHODS */}

        <div className="mt-6 grid gap-5 lg:grid-cols-3">

          <DeliveryCard
            title="Standard Delivery"
            subtitle="Regular nationwide delivery"
            icon={<Truck size={18} />}
            enabled={
              settings.standard.enabled
            }
            onToggle={() =>
              updateMethod(
                "standard",
                "enabled",
                !settings.standard
                  .enabled
              )
            }
          >
            <NumberField
              label="Delivery Charge"
              prefix="Rs."
              min={0}
              value={
                settings.standard.charge
              }
              onChange={(value) =>
                updateMethod(
                  "standard",
                  "charge",
                  value
                )
              }
            />

            <NumberField
              label="Estimated Days"
              min={1}
              value={
                settings.standard
                  .estimatedDays
              }
              onChange={(value) =>
                updateMethod(
                  "standard",
                  "estimatedDays",
                  value
                )
              }
            />
          </DeliveryCard>

          <DeliveryCard
            title="Express Delivery"
            subtitle="Fast premium delivery"
            icon={<Zap size={18} />}
            enabled={
              settings.express.enabled
            }
            onToggle={() =>
              updateMethod(
                "express",
                "enabled",
                !settings.express.enabled
              )
            }
          >
            <NumberField
              label="Delivery Charge"
              prefix="Rs."
              min={0}
              value={
                settings.express.charge
              }
              onChange={(value) =>
                updateMethod(
                  "express",
                  "charge",
                  value
                )
              }
            />

            <NumberField
              label="Estimated Days"
              min={1}
              value={
                settings.express
                  .estimatedDays
              }
              onChange={(value) =>
                updateMethod(
                  "express",
                  "estimatedDays",
                  value
                )
              }
            />
          </DeliveryCard>

          <DeliveryCard
            title="Overnight Delivery"
            subtitle="Next-day premium delivery"
            icon={<Clock3 size={18} />}
            enabled={
              settings.overnight.enabled
            }
            onToggle={() =>
              updateMethod(
                "overnight",
                "enabled",
                !settings.overnight
                  .enabled
              )
            }
          >
            <NumberField
              label="Delivery Charge"
              prefix="Rs."
              min={0}
              value={
                settings.overnight.charge
              }
              onChange={(value) =>
                updateMethod(
                  "overnight",
                  "charge",
                  value
                )
              }
            />

            <NumberField
              label="Estimated Days"
              min={1}
              value={
                settings.overnight
                  .estimatedDays
              }
              onChange={(value) =>
                updateMethod(
                  "overnight",
                  "estimatedDays",
                  value
                )
              }
            />
          </DeliveryCard>
        </div>

        {/* URGENT */}

        <div className="mt-6">

          <SectionCard>

            <div className="flex items-center justify-between gap-4">

              <SectionTitle
                icon={<Zap size={20} />}
                title="Urgent Same-City Delivery"
                description="Offer very fast delivery in selected cities."
              />

              <Toggle
                value={
                  settings.urgent.enabled
                }
                onChange={() =>
                  updateMethod(
                    "urgent",
                    "enabled",
                    !settings.urgent.enabled
                  )
                }
              />
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">

              <NumberField
                label="Delivery Charge"
                prefix="Rs."
                value={
                  settings.urgent.charge
                }
                onChange={(value) =>
                  updateMethod(
                    "urgent",
                    "charge",
                    value
                  )
                }
              />

              <NumberField
                label="Minimum Hours"
                min={1}
                value={
                  settings.urgent
                    .estimatedHoursMin
                }
                onChange={(value) =>
                  updateMethod(
                    "urgent",
                    "estimatedHoursMin",
                    value
                  )
                }
              />

              <NumberField
                label="Maximum Hours"
                min={1}
                value={
                  settings.urgent
                    .estimatedHoursMax
                }
                onChange={(value) =>
                  updateMethod(
                    "urgent",
                    "estimatedHoursMax",
                    value
                  )
                }
              />
            </div>

            <div
              className="
                mt-6
                border-t
                border-[#f0e4e6]
                pt-5

                dark:border-[#332a2f]
              "
            >
              <p
                className="
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-[0.14em]
                  text-[#896c74]

                  dark:text-[#bf9da6]
                "
              >
                Urgent Delivery Cities
              </p>

              <div className="mt-3 flex flex-col gap-2 sm:flex-row">

                <div className="relative flex-1">

                  <MapPin
                    size={14}
                    className="
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      text-[#a47e87]

                      dark:text-[#c98c9d]
                    "
                  />

                  <input
                    type="text"
                    value={cityInput}
                    onChange={(event) =>
                      setCityInput(
                        event.target.value
                      )
                    }
                    onKeyDown={(event) => {
                      if (
                        event.key ===
                        "Enter"
                      ) {
                        event.preventDefault();
                        addCity();
                      }
                    }}
                    placeholder="Enter city name"
                    className="
                      w-full
                      rounded-xl
                      border
                      border-[#e7d6d9]
                      bg-[#fffaf8]
                      py-3
                      pl-9
                      pr-4
                      text-[10px]
                      text-[#553b42]
                      outline-none
                      transition

                      focus:border-[#8b4052]

                      dark:border-[#45363c]
                      dark:bg-[#171417]
                      dark:text-[#f5eaed]
                      dark:placeholder:text-[#766a6e]
                      dark:focus:border-[#b95872]
                    "
                  />
                </div>

                <button
                  type="button"
                  onClick={addCity}
                  className="
                    rounded-xl
                    bg-[#7b3043]
                    px-6
                    py-3
                    text-[8px]
                    font-bold
                    uppercase
                    tracking-[0.12em]
                    text-white
                    transition
                    hover:bg-[#5d2133]

                    dark:bg-[#9d405a]
                    dark:hover:bg-[#b44b68]
                  "
                >
                  Add City
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">

                {settings.urgent.cities.map(
                  (city) => (

                    <div
                      key={city}
                      className="
                        flex
                        items-center
                        gap-2
                        rounded-full
                        border
                        border-[#e4d1d5]
                        bg-[#f9eff1]
                        px-3
                        py-2

                        dark:border-[#47363c]
                        dark:bg-[#271d22]
                      "
                    >
                      <span
                        className="
                          text-[8px]
                          font-semibold
                          capitalize
                          text-[#714650]

                          dark:text-[#e5bdc7]
                        "
                      >
                        {city}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          removeCity(city)
                        }
                        className="
                          text-[#a36d79]
                          hover:text-red-500

                          dark:text-[#cb8294]
                        "
                      >
                        <X size={10} />
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          </SectionCard>
        </div>

        {/* FREE DELIVERY */}

        <div className="mt-6">

          <SectionCard>

            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

              <SectionTitle
                icon={
                  <ShieldCheck
                    size={20}
                  />
                }
                title="Free Delivery"
                description="Automatically remove delivery charges when the order reaches the minimum amount."
              />

              <Toggle
                value={
                  settings
                    .freeDeliveryEnabled
                }
                onChange={() =>
                  setSettings(
                    (current) => ({
                      ...current,

                      freeDeliveryEnabled:
                        !current
                          .freeDeliveryEnabled,
                    })
                  )
                }
              />
            </div>

            <div className="mt-6 max-w-[320px]">

              <NumberField
                label="Free Delivery Above"
                prefix="Rs."
                value={
                  settings
                    .freeDeliveryThreshold
                }
                onChange={(value) =>
                  setSettings(
                    (current) => ({
                      ...current,

                      freeDeliveryThreshold:
                        value,
                    })
                  )
                }
              />
            </div>
          </SectionCard>
        </div>

        <div
          className="
            mt-7
            flex
            justify-end
            border-t
            border-[#ebdcdf]
            pt-6

            dark:border-[#332a2f]
          "
        >
          <SaveButton
            saving={saving}
            onClick={saveSettings}
          />
        </div>
      </div>
    </div>
  );
}

/* ============================================= */

function SectionCard({
  children,
}) {
  return (
    <section
      className="
        rounded-[25px]
        border
        border-[#eadbdd]
        bg-white
        p-5
        shadow-[0_12px_40px_rgba(76,42,52,0.05)]
        transition-colors
        sm:p-6

        dark:border-[#30272c]
        dark:bg-[#1b181b]
        dark:shadow-[0_12px_40px_rgba(0,0,0,0.22)]
      "
    >
      {children}
    </section>
  );
}

function SectionTitle({
  icon,
  title,
  description,
}) {
  return (
    <div className="flex items-center gap-4">

      <div
        className="
          flex
          h-12
          w-12
          shrink-0
          items-center
          justify-center
          rounded-2xl
          bg-[#f7e9ec]
          text-[#7d3045]

          dark:bg-[#35242b]
          dark:text-[#e594a8]
        "
      >
        {icon}
      </div>

      <div>
        <h2
          className="
            text-[14px]
            font-bold
            text-[#51373e]

            dark:text-[#f2e5e8]
          "
        >
          {title}
        </h2>

        <p
          className="
            mt-1
            text-[8px]
            leading-4
            text-[#a18a90]

            dark:text-[#9e9296]
          "
        >
          {description}
        </p>
      </div>
    </div>
  );
}

function DeliveryCard({
  title,
  subtitle,
  icon,
  enabled,
  onToggle,
  children,
}) {
  return (
    <article
      className={`
        flex
        h-full
        flex-col
        rounded-[24px]
        border
        p-5
        transition-colors
        duration-300

        ${
          enabled
            ? `
              border-[#dfc9ce]
              bg-white

              dark:border-[#603444]
              dark:bg-[#1c181b]
            `
            : `
              border-[#ede5e7]
              bg-white
              opacity-75

              dark:border-[#30292c]
              dark:bg-[#171517]
            `
        }
      `}
    >
      <div className="flex items-start justify-between gap-3">

        <div className="flex items-center gap-3">

          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-2xl
              bg-[#f7e9ec]
              text-[#793044]

              dark:bg-[#35242b]
              dark:text-[#e594a8]
            "
          >
            {icon}
          </div>

          <div>
            <h3
              className="
                text-[12px]
                font-bold
                text-[#50363d]

                dark:text-[#f1e5e8]
              "
            >
              {title}
            </h3>

            <p
              className="
                mt-1
                text-[7px]
                text-[#a18b90]

                dark:text-[#95898d]
              "
            >
              {subtitle}
            </p>
          </div>
        </div>

        <Toggle
          value={enabled}
          onChange={onToggle}
        />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {children}
      </div>
    </article>
  );
}

function NumberField({
  label,
  prefix,
  value,
  onChange,
  min = 0,
}) {
  return (
    <label className="block">

      <span
        className="
          mb-2
          block
          text-[7px]
          font-bold
          uppercase
          tracking-[0.12em]
          text-[#92767d]

          dark:text-[#b69aa2]
        "
      >
        {label}
      </span>

      <div
        className="
          flex
          min-h-[42px]
          items-center
          overflow-hidden
          rounded-xl
          border
          border-[#e7d7da]
          bg-[#fffaf8]

          focus-within:border-[#8a4052]

          dark:border-[#42353a]
          dark:bg-[#141214]
          dark:focus-within:border-[#b6536c]
        "
      >
        {prefix && (
          <span
            className="
              border-r
              border-[#eadde0]
              px-3
              text-[9px]
              font-bold
              text-[#875562]

              dark:border-[#403338]
              dark:text-[#d28a9d]
            "
          >
            {prefix}
          </span>
        )}

        <input
          type="number"
          min={min}
          value={value}
          onChange={(event) =>
            onChange(
              Number(
                event.target.value
              )
            )
          }
          className="
            w-full
            bg-transparent
            px-3
            py-3
            text-[10px]
            font-semibold
            text-[#503940]
            outline-none

            dark:text-[#f4e9ec]
          "
        />
      </div>
    </label>
  );
}

function Toggle({
  value,
  onChange,
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-pressed={value}
      className={`relative h-[26px] w-[46px] shrink-0 rounded-full transition duration-300 ${
        value
          ? "bg-[#793044] dark:bg-[#ae4762]"
          : "bg-[#d9cccf] dark:bg-[#4a4245]"
      }`}
    >
      <span
        className={`absolute top-[4px] h-[18px] w-[18px] rounded-full bg-white shadow-sm transition-all duration-300 ${
          value
            ? "left-[24px]"
            : "left-[4px]"
        }`}
      />
    </button>
  );
}

function SaveButton({
  saving,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={saving}
      className="
        inline-flex
        min-h-[44px]
        items-center
        justify-center
        gap-2
        rounded-full
        bg-[#70283d]
        px-7
        text-[8px]
        font-bold
        uppercase
        tracking-[0.14em]
        text-white
        shadow-[0_12px_30px_rgba(112,40,61,0.18)]
        transition
        duration-300

        hover:-translate-y-0.5
        hover:bg-[#571d30]

        disabled:opacity-50

        dark:bg-[#a4415c]
        dark:hover:bg-[#bd4b69]
      "
    >
      <Save size={14} />

      {saving
        ? "Saving..."
        : "Save Changes"}
    </button>
  );
}

export default AdminSettings;
import prisma from "../lib/prisma.js";

/* =====================================================
   DEFAULT DELIVERY SETTINGS
===================================================== */

const DEFAULT_SETTINGS = {
  deliveryEnabled: true,

  standardEnabled: true,
  standardCharge: 200,
  standardEstimatedDays: 5,

  expressEnabled: true,
  expressCharge: 350,
  expressEstimatedDays: 2,

  overnightEnabled: false,
  overnightCharge: 500,
  overnightEstimatedDays: 1,

  urgentEnabled: false,
  urgentCharge: 300,
  urgentEstimatedHoursMin: 1,
  urgentEstimatedHoursMax: 2,
  urgentCities: ["lahore"],

  freeDeliveryEnabled: false,
  freeDeliveryThreshold: 5000,
};

/* =====================================================
   FORMAT DATABASE SETTINGS
===================================================== */

const formatDeliverySettings = (
  settings
) => {
  return {
    enabled:
      settings.deliveryEnabled,

    standard: {
      enabled:
        settings.standardEnabled,

      charge:
        settings.standardCharge,

      estimatedDays:
        settings.standardEstimatedDays,
    },

    express: {
      enabled:
        settings.expressEnabled,

      charge:
        settings.expressCharge,

      estimatedDays:
        settings.expressEstimatedDays,
    },

    overnight: {
      enabled:
        settings.overnightEnabled,

      charge:
        settings.overnightCharge,

      estimatedDays:
        settings.overnightEstimatedDays,
    },

    urgent: {
      enabled:
        settings.urgentEnabled,

      charge:
        settings.urgentCharge,

      estimatedHoursMin:
        settings
          .urgentEstimatedHoursMin,

      estimatedHoursMax:
        settings
          .urgentEstimatedHoursMax,

      cities:
        settings.urgentCities || [],
    },

    freeDeliveryEnabled:
      settings.freeDeliveryEnabled,

    freeDeliveryThreshold:
      settings.freeDeliveryThreshold,
  };
};

/* =====================================================
   GET OR CREATE GLOBAL SETTINGS
===================================================== */

const getOrCreateSettings =
  async () => {
    return prisma.settings.upsert({
      where: {
        key: "global",
      },

      update: {},

      create: {
        key: "global",

        ...DEFAULT_SETTINGS,
      },
    });
  };

/* =====================================================
   GET DELIVERY SETTINGS
   GET /api/settings/delivery
===================================================== */

export const getDeliverySettings =
  async (req, res) => {
    try {
      const settings =
        await getOrCreateSettings();

      return res.status(200).json({
        success: true,

        delivery:
          formatDeliverySettings(
            settings
          ),
      });
    } catch (error) {
      console.error(
        "GET DELIVERY SETTINGS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Unable to load delivery settings.",
      });
    }
  };

/* =====================================================
   UPDATE DELIVERY SETTINGS
   PUT /api/settings/delivery
===================================================== */

export const updateDeliverySettings =
  async (req, res) => {
    try {
      const { delivery } =
        req.body;

      if (!delivery) {
        return res.status(400).json({
          success: false,

          message:
            "Delivery settings are required.",
        });
      }

      /* ===============================
         STANDARD
      =============================== */

      const standardCharge =
        Number(
          delivery.standard?.charge
        );

      const standardDays =
        Number(
          delivery.standard
            ?.estimatedDays
        );

      /* ===============================
         EXPRESS
      =============================== */

      const expressCharge =
        Number(
          delivery.express?.charge
        );

      const expressDays =
        Number(
          delivery.express
            ?.estimatedDays
        );

      /* ===============================
         OVERNIGHT
      =============================== */

      const overnightCharge =
        Number(
          delivery.overnight?.charge
        );

      const overnightDays =
        Number(
          delivery.overnight
            ?.estimatedDays
        );

      /* ===============================
         URGENT
      =============================== */

      const urgentCharge =
        Number(
          delivery.urgent?.charge
        );

      const urgentMin =
        Number(
          delivery.urgent
            ?.estimatedHoursMin
        );

      const urgentMax =
        Number(
          delivery.urgent
            ?.estimatedHoursMax
        );

      /* ===============================
         FREE DELIVERY
      =============================== */

      const freeThreshold =
        Number(
          delivery
            .freeDeliveryThreshold
        );

      /* ===============================
         CHARGE VALIDATION
      =============================== */

      const chargeValues = [
        standardCharge,
        expressCharge,
        overnightCharge,
        urgentCharge,
        freeThreshold,
      ];

      const invalidCharge =
        chargeValues.some(
          (value) =>
            !Number.isFinite(value) ||
            value < 0
        );

      if (invalidCharge) {
        return res.status(400).json({
          success: false,

          message:
            "Delivery charges must be valid numbers greater than or equal to 0.",
        });
      }

      /* ===============================
         DAYS VALIDATION
      =============================== */

      if (
        !Number.isInteger(
          standardDays
        ) ||
        standardDays < 1 ||
        !Number.isInteger(
          expressDays
        ) ||
        expressDays < 1 ||
        !Number.isInteger(
          overnightDays
        ) ||
        overnightDays < 1
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Estimated delivery days must be at least 1.",
        });
      }

      /* ===============================
         URGENT HOURS VALIDATION
      =============================== */

      if (
        !Number.isInteger(
          urgentMin
        ) ||
        !Number.isInteger(
          urgentMax
        ) ||
        urgentMin < 1 ||
        urgentMax < urgentMin
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Urgent delivery hours are invalid.",
        });
      }

      /* ===============================
         URGENT CITIES
      =============================== */

      const urgentCities =
        Array.isArray(
          delivery.urgent?.cities
        )
          ? [
              ...new Set(
                delivery.urgent.cities
                  .map((city) =>
                    String(city)
                      .trim()
                      .toLowerCase()
                  )
                  .filter(Boolean)
              ),
            ]
          : [];

      if (
        delivery.urgent?.enabled &&
        urgentCities.length === 0
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Add at least one city for urgent delivery.",
        });
      }

      /* ===============================
         DATABASE DATA
      =============================== */

      const data = {
        deliveryEnabled:
          Boolean(
            delivery.enabled
          ),

        standardEnabled:
          Boolean(
            delivery.standard
              ?.enabled
          ),

        standardCharge,

        standardEstimatedDays:
          standardDays,

        expressEnabled:
          Boolean(
            delivery.express
              ?.enabled
          ),

        expressCharge,

        expressEstimatedDays:
          expressDays,

        overnightEnabled:
          Boolean(
            delivery.overnight
              ?.enabled
          ),

        overnightCharge,

        overnightEstimatedDays:
          overnightDays,

        urgentEnabled:
          Boolean(
            delivery.urgent
              ?.enabled
          ),

        urgentCharge,

        urgentEstimatedHoursMin:
          urgentMin,

        urgentEstimatedHoursMax:
          urgentMax,

        urgentCities,

        freeDeliveryEnabled:
          Boolean(
            delivery
              .freeDeliveryEnabled
          ),

        freeDeliveryThreshold:
          freeThreshold,
      };

      /* ===============================
         SAVE SETTINGS
      =============================== */

      const settings =
        await prisma.settings.upsert({
          where: {
            key: "global",
          },

          update: data,

          create: {
            key: "global",

            ...data,
          },
        });

      return res.status(200).json({
        success: true,

        message:
          "Delivery settings updated successfully.",

        delivery:
          formatDeliverySettings(
            settings
          ),
      });
    } catch (error) {
      console.error(
        "UPDATE DELIVERY SETTINGS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Unable to update delivery settings.",
      });
    }
  };
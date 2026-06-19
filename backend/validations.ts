import { z } from "zod";

// â”€â”€ Auth â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const registerSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
});

// â”€â”€ Studio+ â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const studioBookingSchema = z.object({
  clientFirstName: z.string().min(2),
  clientLastName: z.string().min(2),
  clientEmail: z.string().email(),
  clientPhone: z.string().min(8),
  clientWhatsapp: z.string().optional(),
  clientAddress: z.string().optional(),
  eventType: z.enum([
    "Mariage", "Bapteme", "Conference", "Concert",
    "Anniversaire", "Entreprise", "Autre",
  ]),
  eventDate: z.string().datetime(),
  eventTimeSlot: z.enum(["matin", "apres-midi", "soiree", "journee"]),
  eventLocation: z.string().min(3),
  eventDuration: z.enum(["2h", "4h", "6h", "8h", "journee"]),
  guestCount: z.number().int().positive().optional(),
  description: z.string().max(500).optional(),
  services: z.array(z.string()).min(1),
  attachments: z.array(z.string()).optional(),
});

export const studioStatusSchema = z.object({
  status: z.enum(["CONFIRMED", "REFUSED", "CANCELLED", "COMPLETED"]),
  adminNotes: z.string().optional(),
  quotePdfUrl: z.string().url().optional(),
  totalAmount: z.number().int().positive().optional(),
  depositAmount: z.number().int().positive().optional(),
});

// â”€â”€ Excursions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const excursionBookingSchema = z.object({
  excursionId: z.string().cuid(),
  clientFirstName: z.string().min(2),
  clientLastName: z.string().min(2),
  clientEmail: z.string().email(),
  clientPhone: z.string().min(8),
  clientNationality: z.string().optional(),
  bookingDate: z.string(),
  timeSlot: z.string(),
  guideLanguage: z.enum(["FR", "EN", "ES", "DE", "IT", "PT"]).default("FR"),
  adultsCount: z.number().int().min(1),
  childrenCount: z.number().int().min(0).default(0),
  specialRequests: z.string().optional(),
  conditionsAccepted: z.literal(true),
  selectedOptions: z.array(z.object({
    optionId: z.string(),
    label: z.string(),
    pricePerPerson: z.number(),
    quantity: z.number(),
  })).optional(),
});

// â”€â”€ Event & Organisation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const eventRequestSchema = z.object({
  clientFirstName: z.string().min(2),
  clientLastName: z.string().min(2),
  clientEmail: z.string().email(),
  clientPhone: z.string().min(8),
  eventType: z.string().min(2),
  eventDate: z.string().datetime(),
  eventLocation: z.string().min(3),
  guestCount: z.number().int().positive(),
  budget: z.string().optional(),
  services: z.array(z.string()).min(1),
  attachments: z.array(z.string()).optional(),
  description: z.string().optional(),
});

export const eventStatusSchema = z.object({
  status: z.enum(["CONFIRMED", "REFUSED", "CANCELLED", "COMPLETED"]),
  adminNotes: z.string().optional(),
  quotePdfUrl: z.string().url().optional(),
  totalAmount: z.number().int().positive().optional(),
});

// â”€â”€ Paiement â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const paymentSchema = z.object({
  amount: z.number().int().positive(),
  method: z.enum(["ORANGE_MONEY", "MTN_MONEY", "MOOV_MONEY", "WAVE", "CASH", "BANK_TRANSFER"]),
  phoneNumber: z.string().optional(),
  // Un seul de ces champs doit Ãªtre renseignÃ©
  studioBookingId: z.string().optional(),
  excursionBookingId: z.string().optional(),
  eventRequestId: z.string().optional(),
  hotelBookingId: z.string().optional(),
  musicBookingId: z.string().optional(),
  equipmentRentalId: z.string().optional(),
});



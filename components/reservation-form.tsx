"use client"

import { useState, useTransition } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import type { Vehicle } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Download, Car } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useI18n } from "@/context/i18n-context"
import { submitReservation } from "@/lib/actions"
import { toast } from "@/components/ui/use-toast"

interface ReservationFormProps {
  vehicle?: Vehicle
  onFormSubmitSuccess?: () => void
}

const ReservationFormSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    idOrPassport: z.string().min(1, "ID or Passport is required"),
    phone: z.string().min(1, "Phone number is required"),
    email: z.string().email("Invalid email address"),
    pickupDate: z.date({ required_error: "Pickup date is required." }),
    pickupTime: z.string().min(1, "Pickup time is required"),
    returnDate: z.date({ required_error: "Return date is required." }),
    returnTime: z.string().min(1, "Return time is required"),
    additionalComments: z.string().optional(),
    vehicleId: z.string().optional(),
    vehicleName: z.string().optional(),
  })
  .refine((data) => data.returnDate >= data.pickupDate, {
    message: "Return date must be after or same as pickup date",
    path: ["returnDate"],
  })

type ReservationFormData = z.infer<typeof ReservationFormSchema>

const timeSlots = Array.from({ length: 24 * 2 }, (_, i) => {
  const hour = Math.floor(i / 2)
  const minute = (i % 2) * 30
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
})

export default function ReservationForm({ vehicle, onFormSubmitSuccess }: ReservationFormProps) {
  const { t } = useI18n()
  const [isPending, startTransition] = useTransition()
  const [icsUrl, setIcsUrl] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ReservationFormData>({
    resolver: zodResolver(ReservationFormSchema),
    defaultValues: {
      vehicleId: vehicle?.id,
      vehicleName: vehicle?.name,
      pickupTime: "10:00",
      returnTime: "10:00",
    },
  })

  const pickupDate = watch("pickupDate")

  const onSubmit: SubmitHandler<ReservationFormData> = (data) => {
    startTransition(async () => {
      try {
        const result = await submitReservation(data)
        if (result.success) {
          toast({
            title: "¡Éxito!",
            description: t("successMessage", "reservationForm"),
            variant: "default",
            className: "bg-kadoshGreen-DEFAULT text-kadoshBlack-DEFAULT",
          })
          if (result.icsData) {
            const blob = new Blob([result.icsData], { type: "text/calendar;charset=utf-8" })
            const url = URL.createObjectURL(blob)
            setIcsUrl(url)
          }
          if (onFormSubmitSuccess) onFormSubmitSuccess()
        } else {
          toast({
            title: "Error",
            description: result.message || t("errorMessage", "reservationForm"),
            variant: "destructive",
          })
          setIcsUrl(null)
        }
      } catch (error) {
        toast({
          title: "Error",
          description: t("errorMessage", "reservationForm"),
          variant: "destructive",
        })
        setIcsUrl(null)
      }
    })
  }

  return (
    <div className="bg-card rounded-2xl shadow-2xl border border-gray-800 overflow-hidden">
      <div className="bg-gradient-to-r from-kadoshGreen-DEFAULT to-kadoshGreen-dark p-6">
        <h2 className="text-3xl font-bold text-kadoshBlack-DEFAULT mb-2">{t("title", "reservationForm")}</h2>
        <p className="text-kadoshBlack-DEFAULT/80">{t("subtitle", "reservationForm")}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
        {vehicle && (
          <div className="bg-kadoshBlack-light rounded-xl p-4 border border-kadoshGreen-DEFAULT/30">
            <div className="flex items-center gap-3">
              <Car className="text-kadoshGreen-DEFAULT" size={24} />
              <div>
                <p className="text-sm text-gray-400">{t("reservingVehicle", "reservationForm")}</p>
                <p className="text-lg font-semibold text-kadoshGreen-DEFAULT">{vehicle.name}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-kadoshGreen-DEFAULT font-medium">
              {t("firstName", "reservationForm")}
            </Label>
            <Input
              id="firstName"
              {...register("firstName")}
              className="bg-input border-gray-700 focus:border-kadoshGreen-DEFAULT h-12"
            />
            {errors.firstName && <p className="text-red-400 text-sm">{errors.firstName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-kadoshGreen-DEFAULT font-medium">
              {t("lastName", "reservationForm")}
            </Label>
            <Input
              id="lastName"
              {...register("lastName")}
              className="bg-input border-gray-700 focus:border-kadoshGreen-DEFAULT h-12"
            />
            {errors.lastName && <p className="text-red-400 text-sm">{errors.lastName.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="idOrPassport" className="text-kadoshGreen-DEFAULT font-medium">
              {t("idOrPassport", "reservationForm")}
            </Label>
            <Input
              id="idOrPassport"
              {...register("idOrPassport")}
              className="bg-input border-gray-700 focus:border-kadoshGreen-DEFAULT h-12"
            />
            {errors.idOrPassport && <p className="text-red-400 text-sm">{errors.idOrPassport.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-kadoshGreen-DEFAULT font-medium">
              {t("phone", "reservationForm")}
            </Label>
            <Input
              id="phone"
              type="tel"
              {...register("phone")}
              className="bg-input border-gray-700 focus:border-kadoshGreen-DEFAULT h-12"
            />
            {errors.phone && <p className="text-red-400 text-sm">{errors.phone.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-kadoshGreen-DEFAULT font-medium">
            {t("email", "reservationForm")}
          </Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            className="bg-input border-gray-700 focus:border-kadoshGreen-DEFAULT h-12"
          />
          {errors.email && <p className="text-red-400 text-sm">{errors.email.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-kadoshGreen-DEFAULT font-medium">{t("pickupDate", "reservationForm")}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-12 bg-input border-gray-700 hover:border-kadoshGreen-DEFAULT",
                    !watch("pickupDate") && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {watch("pickupDate") ? format(watch("pickupDate"), "PPP") : <span>{t("selectDate", "common")}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-card border-kadoshGreen-DEFAULT">
                <Calendar
                  mode="single"
                  selected={watch("pickupDate")}
                  onSelect={(date) => setValue("pickupDate", date as Date)}
                  initialFocus
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                />
              </PopoverContent>
            </Popover>
            {errors.pickupDate && <p className="text-red-400 text-sm">{errors.pickupDate.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="pickupTime" className="text-kadoshGreen-DEFAULT font-medium">
              {t("pickupTime", "reservationForm")}
            </Label>
            <select
              id="pickupTime"
              {...register("pickupTime")}
              className="w-full h-12 p-3 border border-gray-700 rounded-md bg-input focus:ring-kadoshGreen-DEFAULT focus:border-kadoshGreen-DEFAULT"
            >
              {timeSlots.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            {errors.pickupTime && <p className="text-red-400 text-sm">{errors.pickupTime.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-kadoshGreen-DEFAULT font-medium">{t("returnDate", "reservationForm")}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-12 bg-input border-gray-700 hover:border-kadoshGreen-DEFAULT",
                    !watch("returnDate") && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {watch("returnDate") ? format(watch("returnDate"), "PPP") : <span>{t("selectDate", "common")}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-card border-kadoshGreen-DEFAULT">
                <Calendar
                  mode="single"
                  selected={watch("returnDate")}
                  onSelect={(date) => setValue("returnDate", date as Date)}
                  initialFocus
                  disabled={(date) =>
                    pickupDate ? date < pickupDate : date < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                />
              </PopoverContent>
            </Popover>
            {errors.returnDate && <p className="text-red-400 text-sm">{errors.returnDate.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="returnTime" className="text-kadoshGreen-DEFAULT font-medium">
              {t("returnTime", "reservationForm")}
            </Label>
            <select
              id="returnTime"
              {...register("returnTime")}
              className="w-full h-12 p-3 border border-gray-700 rounded-md bg-input focus:ring-kadoshGreen-DEFAULT focus:border-kadoshGreen-DEFAULT"
            >
              {timeSlots.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            {errors.returnTime && <p className="text-red-400 text-sm">{errors.returnTime.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="additionalComments" className="text-kadoshGreen-DEFAULT font-medium">
            {t("additionalComments", "reservationForm")}
          </Label>
          <Textarea
            id="additionalComments"
            {...register("additionalComments")}
            className="bg-input border-gray-700 focus:border-kadoshGreen-DEFAULT min-h-[100px]"
            placeholder="Any special requests or comments..."
          />
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-kadoshGreen-DEFAULT text-kadoshBlack-DEFAULT hover:bg-kadoshGreen-dark h-14 text-lg font-semibold"
        >
          {isPending ? t("loading", "common") : t("submit", "reservationForm")}
        </Button>

        {icsUrl && (
          <a
            href={icsUrl}
            download={`${vehicle?.name || "Kadosh_Reservation"}_${format(watch("pickupDate"), "yyyyMMdd")}.ics`}
            className="mt-4 inline-flex items-center justify-center w-full px-4 py-3 border border-kadoshGreen-DEFAULT text-sm font-medium rounded-md text-kadoshGreen-DEFAULT hover:bg-kadoshGreen-DEFAULT hover:text-kadoshBlack-DEFAULT focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kadoshGreen-DEFAULT transition-all duration-200"
          >
            <Download className="mr-2 h-4 w-4" /> {t("downloadICS", "reservationForm")}
          </a>
        )}
      </form>
    </div>
  )
}

import styled from "styled-components";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import { useCabin } from "../cabins/useCabin";
import { formatCurrency } from "../../utils/helpers";
import Checkbox from "../../ui/Checkbox";
import Button from "../../ui/Button";
import Spinner from "../../ui/Spinner";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useGuests } from "./useGuests";
import useSettings from "../settings/useSettings";
import { isDate } from "date-fns";
import { useCreateBooking } from "./useCreateBooking";

const StyledSelect = styled.select`
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  padding: 0.8rem 1.2rem;
  box-shadow: var(--shadow-sm);
`;

export default function CreateBookingForm({ onClose }) {
  const [wantsBreakfast, setWantsBreakfast] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const { data: cabins, isLoading } = useCabin();
  const { guests, isLoadingGuests } = useGuests();
  const { data: settings, isLoading: isLoadingSettings } = useSettings();
  const { createBooking, isCreating } = useCreateBooking();

  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
  } = useForm();

  function onSubmit(data) {
    const numNights = Number(data.numNights);
    const numGuests = Number(data.numGuests);

    // 1. Temukan data kabin spesifik yang dipilih oleh user dari dropdown
    const reservedCabin = cabins.find((cabin) => cabin.id === Number(data.cabinId));

    // 2. Kalkulasi Harga Kabin (Harga Normal - Diskon) * Jumlah Malam
    const cabinPrice = (reservedCabin.regularPrice - reservedCabin.discount) * numNights;

    // 3. Kalkulasi Harga Ekstra (Sarapan)
    // Jika user mencentang sarapan, hitung: harga sarapan * jumlah malam * jumlah tamu
    const extrasPrice = wantsBreakfast
      ? settings.breakfastPrice * numNights * numGuests
      : 0;

    // 4. Kalkulasi Total Keseluruhan
    const totalPrice = cabinPrice + extrasPrice;

    // 5. Susun data akhir yang 100% cocok dengan struktur tabel Supabase
    const bookingData = {
      guestId: Number(data.guestId),
      cabinId: Number(data.cabinId),
      startDate: data.startDate,
      endDate: data.endDate,
      numNights: numNights,
      numGuests: numGuests,
      observations: data.observations,

      // Mengubah format checkbox (boolean)
      hasBreakfast: wantsBreakfast,
      isPaid: isPaid,

      // Memasukkan hasil kalkulasi harga
      cabinPrice: cabinPrice,
      extrasPrice: extrasPrice,
      totalPrice: totalPrice,

      // Status wajib saat booking baru dibuat
      status: "unconfirmed",
    };

    // 6. Kirim ke Supabase!
    createBooking(bookingData, {
      onSuccess: () => {
        // Tutup modal HANYA JIKA proses simpan ke database berhasil
        onClose?.();
      },
    });
  }

  if (isLoading || isLoadingGuests || isLoadingSettings) return <Spinner />;

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow label="Select guest">
        <StyledSelect
          id="guestId"
          {...register("guestId")}
          disabled={isCreating}
        >
          {guests?.map((guest) => (
            <option key={guest.id} value={guest.id}>
              {guest.fullName}
            </option>
          ))}
        </StyledSelect>
      </FormRow>
      <FormRow label="Start Date" error={errors?.startDate?.message}>
        <Input
          disabled={isCreating}
          type="date"
          id="startDate"
          {...register("startDate", {
            required: {
              message: "This field is required",
            },
          })}
        />
      </FormRow>
      <FormRow label="End Date" error={errors?.endDate?.message}>
        <Input
          disabled={isCreating}
          type="date"
          id="endDate"
          {...register("endDate", {
            required: "This field is required",
            validate:
              isDate(getValues().endDate) || "You must choose a valid date",
          })}
        />
      </FormRow>
      <FormRow label="Number of Nights" error={errors?.numNights?.message}>
        <Input
          disabled={isCreating}
          type="number"
          id="numNights"
          min={1}
          defaultValue={1}
          {...register("numNights", {
            required: {
              message: "This field is required",
            },
          })}
        />
      </FormRow>
      <FormRow label="Number of Guests" error={errors?.numGuests?.message}>
        <Input
          disabled={isCreating}
          type="number"
          id="numGuests"
          min={1}
          defaultValue={1}
          {...register("numGuests", {
            required: "This field is required",
            min: {
              value: 1,
              message: "Minimum number of guests must be 1",
            },
            max: {
              value: settings.maxGuestsPerBooking,
              message: `Max number of guests must be ${settings.maxGuestsPerBooking}`,
            },
          })}
        />
      </FormRow>
      <FormRow label="Select cabin" error={errors?.cabinId?.message}>
        <StyledSelect
          disabled={isCreating}
          id="cabinId"
          {...register("cabinId", {
            required: {
              message: "This field is required",
            },
          })}
        >
          {cabins.map((cabin) => (
            <option key={cabin.id} value={cabin.id}>
              Cabin : {cabin.name}
              &nbsp; <p>Price : {formatCurrency(cabin.regularPrice)}</p>
            </option>
          ))}
        </StyledSelect>
      </FormRow>
      <FormRow
        label="Further observations"
        error={errors?.observations?.message}
      >
        <Input
          disabled={isCreating}
          type="text"
          id="observations"
          {...register("observations", {
            required: {
              message: "This field is required",
            },
          })}
        />
      </FormRow>
      <FormRow>
        <Checkbox
          disabled={isCreating}
          checked={wantsBreakfast}
          id="hasBreakfast"
          onChange={() => setWantsBreakfast((c) => !c)}
        >
          I want breakfast with my booking
        </Checkbox>
      </FormRow>
      <FormRow>
        <Checkbox
          disabled={isCreating}
          checker={isPaid}
          id="isPaid"
          onChange={() => setIsPaid((c) => !c)}
        >
          This booking is paid
        </Checkbox>
      </FormRow>
      <FormRow>
        <Button disabled={isCreating} type="submit" variation="primary">
          Submit
        </Button>
        <Button
          disabled={isCreating}
          type="button"  /* <-- Harus "button" agar tidak men-submit form */
          variation="secondary"
          onClick={() => onClose?.()} /* <-- Jalankan penutup modal saat diklik */
        >
          Cancel
        </Button>
      </FormRow>
    </Form>
  );
}

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

export default function CreateBookingForm() {
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
    createBooking(data);
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
          value={wantsBreakfast}
          id="breakfast"
          onChange={() => setWantsBreakfast((c) => !c)}
          {...register("breakfast")}
        >
          I want breakfast with my booking
        </Checkbox>
      </FormRow>
      <FormRow>
        <Checkbox
          disabled={isCreating}
          value={isPaid}
          id="paid"
          onChange={() => setIsPaid((c) => !c)}
          {...register("paid")}
        >
          This booking is paid
        </Checkbox>
      </FormRow>
      <FormRow>
        <Button disabled={isCreating} type="submit" variation="primary">
          Submit
        </Button>
        <Button disabled={isCreating} type="cancel" variation="secondary">
          Cancel
        </Button>
      </FormRow>
    </Form>
  );
}

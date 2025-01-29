import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import CreateBookingForm from "./CreateBookingForm";

export default function CreateBooking() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="booking-form">
          <Button size="medium">Create Booking</Button>
        </Modal.Open>
        <Modal.Window name="booking-form">
          <CreateBookingForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

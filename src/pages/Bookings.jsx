import BookingTable from "../features/bookings/BookingTable";
import BookingTableOperations from "../features/bookings/BookingTableOperations";
import CreateBooking from "../features/bookings/CreateBooking";
import Button from "../ui/Button";
import Heading from "../ui/Heading";
import Row from "../ui/Row";

function Bookings() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">All bookings</Heading>
        <BookingTableOperations />
        {/* <Button size="medium">Create Booking</Button> */}
        <CreateBooking />
      </Row>
      <BookingTable />
    </>
  );
}

export default Bookings;

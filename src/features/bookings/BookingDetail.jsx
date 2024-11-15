import styled from "styled-components";

import BookingDataBox from "./BookingDataBox";
import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import Tag from "../../ui/Tag";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";

import { useMoveBack } from "../../hooks/useMoveBack";
import { useBookingDetail } from "./useBookingDetail";
import Spinner from "../../ui/Spinner";
import { useNavigate } from "react-router-dom";
import { HiArrowUpOnSquare, HiTrash } from "react-icons/hi2";
import { useCheckout } from "../check-in-out/useCheckout";
import { useDeleteBooking } from "./useDeleteBooking";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Empty from "../../ui/Empty";

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

function BookingDetail() {
  const { data, isLoading } = useBookingDetail();
  const status = data?.status;

  const navigate = useNavigate();

  const { checkout, isCheckingOut } = useCheckout();
  const { isDeleting, deletingBooking } = useDeleteBooking();

  const moveBack = useMoveBack();
  if (!data) return <Empty resource="booking" />;
  if (isLoading) return <Spinner />;

  const statusToTagName = {
    unconfirmed: "blue",
    "checked-in": "green",
    "checked-out": "silver",
  };

  return (
    <Modal>
      <Row type="horizontal">
        <HeadingGroup>
          <Heading as="h1">Booking #{data.id}</Heading>
          <Tag type={statusToTagName[status]}>{status.replace("-", " ")}</Tag>
        </HeadingGroup>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={data} />

      <ButtonGroup>
        <Modal.Open opens="delete">
          <Button icon={<HiTrash />} disabled={isDeleting}>
            Delete
          </Button>
        </Modal.Open>

        <Modal.Window name="delete">
          <ConfirmDelete
            resourceName="booking"
            onConfirm={() =>
              deletingBooking(data.id, {
                onSettled: () => navigate(-1),
              })
            }
            disabled={isDeleting}
          />
        </Modal.Window>

        {status === "unconfirmed" && (
          <Button onClick={() => navigate(`/checkin/${data.id}`)}>
            Check In
          </Button>
        )}
        {status === "checked-in" && (
          <Button
            icon={<HiArrowUpOnSquare />}
            onClick={() => checkout(data.id)}
            disabled={isCheckingOut}
          >
            Check Out
          </Button>
        )}
        <Button variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </Modal>
  );
}

export default BookingDetail;

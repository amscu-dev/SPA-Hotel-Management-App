import { useBookings } from "./useBookings";
import BookingRow from "./BookingRow";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Empty from "../../ui/Empty";
import Spinner from "../../ui/Spinner";
import Pagination from "../../ui/Pagination";

// Filtering on Server Side
function BookingTable() {
  // Vom obtine state-ul din URL in hook-ul intermediar
  const { isLoading, bookings, count } = useBookings();

  // Dacă datele sunt încă încărcate, afișăm un spinner
  if (isLoading) return <Spinner />;

  // Dacă nu există rezervări, afișăm un mesaj Empty
  if (!bookings.length) return <Empty resourceName="bookings" />;
  return (
    <Menus>
      <Table columns="0.6fr 2fr 2.4fr 1.4fr 1fr 3.2rem">
        <Table.Header>
          <div>Cabin</div>
          <div>Guest</div>
          <div>Dates</div>
          <div>Status</div>
          <div>Amount</div>
          <div></div>
        </Table.Header>
        <Table.Body
          data={bookings}
          render={(booking) => (
            <BookingRow key={booking.id} booking={booking} />
          )}
        />
        <Table.Footer>
          {/* PaginatIon  seteaza state-ul in URL */}
          <Pagination count={count} />
        </Table.Footer>
      </Table>
    </Menus>
  );
}

export default BookingTable;

export default function PaymentCustomerInfo({ customer }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Customer Information</h2>
      <div className="flex flex-col gap-2">
        <p>
          <strong>Name:</strong> {customer.name}
        </p>
        <p>
          <strong>Email:</strong> {customer.email}
        </p>
        <p>
          <strong>Phone:</strong> {customer.phone}
        </p>
      </div>
    </div>
  );
}
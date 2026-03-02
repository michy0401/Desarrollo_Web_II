export const AmountDisplay = ({ label, amount }) => {
  return (
    <div className="text-2xl text-blue-600 font-bold">
      {label && `${label}: `}
      <span className="font-black text-black">
        {/* Esto formatea el número a moneda de forma automática */}
        {amount.toLocaleString("en-US", { style: "currency", currency: "USD" })}
      </span>
    </div>
  )
}
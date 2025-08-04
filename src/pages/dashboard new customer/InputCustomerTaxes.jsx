import TaxAddingForm from "../../components/UI/TaxAddingForm"
import PlusButtonForAddingTax from "../../components/UI/PlusButtonForAddingTax"


export default function InputCustomerTaxes ({ selectedTaxs, handleSelectTax, handleTaxRemove, control, listOfAvailableTaxs }) {
  return (
    <>
    {/* the new field based on the selected tax */}
    
    {selectedTaxs.map((tax) => {
      return (
        <TaxAddingForm
          key={tax.id}
          nameOfTax={tax.tax_name}
          fieldName={`${tax.id}`}
          control={control}
          onRemove={() => handleTaxRemove(tax)}
        />
      )
    })}
  

    {/* select to add new taxs fields */}
    
      {listOfAvailableTaxs.length > 0 &&(

        <PlusButtonForAddingTax 
          availableTaxs={listOfAvailableTaxs} 
          onTaxSelect={handleSelectTax}
        />
      )}
    </>
  )
}
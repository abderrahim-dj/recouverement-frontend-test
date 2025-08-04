//this function will create the json format who will send to my backend to store the user infos

export default function (customerInfo, formData) {
  const dataForSaving = {
    "customer_id": formData.customer_id,
    "customer_firstname": customerInfo.data.nom,
    "customer_lastname": customerInfo.data.prenom,
    "customer_mobile": customerInfo.data.mobile,
    "customer_email": customerInfo.data.email,
    "customer_address": customerInfo.data.adresse,
    "customer_wilaya": customerInfo.data.wilaya,
    "customer_commune": customerInfo.data.commune,
    "customer_daira": customerInfo.data.daira,
    "customer_postal_code": customerInfo.data.code_postal,


    "customer_belong_to": formData.customer_belong_to,  
    "customer_belong_to_name_autre": formData.customer_belong_to_name_autre,  

    "customer_apport_personnel": formData.customer_frais_apport_personnel,  
    
    "customer_frais_service": formData.customer_frais_service_amount,
    "customer_service_name":formData.customer_frais_service,
    
    "customer_frais_virement":formData.customer_frais_virement,

    "customer_frais_ramassage":formData.customer_frais_ramassage,
    
    "customer_frais_cash":formData.customer_frais_cash,



    "products": customerInfo.data.produits.map((product) => (
        {
          "product_name": product.produit,
          "product_price": product.prix,
          "product_quantity": product.quantité,
          "product_brand": product.marque
        }
      )),

    "extra_taxes_for_paying" : Object.entries(formData.taxes_for_payment || {}).map((([tax_id, amount]) => ({
      tax_id,
      amount
    })))
     
  
    }

    return dataForSaving;
  
}
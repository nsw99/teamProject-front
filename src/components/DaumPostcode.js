const DaumPostcode = ({onAddressSelected}) => {
    const handleAddressSelected = (data) =>{
        onAddressSelected(data.address);
    };
    new window.daum.Postcode({
        oncomplete: function(data) {            
            handleAddressSelected(data);
        }
    }).open();
};
export default DaumPostcode;
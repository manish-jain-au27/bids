import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const ProformaDocument = ({ proformaDetails }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>Proforma No: {proformaDetails.acceptedBid._id}</Text>
        <Text>Company Name: {proformaDetails.offer.companyName}</Text>
        <Text>Register Address: {proformaDetails.offer.companyId?.registerAddress?.address}</Text>
        <Text>Pincode: {proformaDetails.offer.companyId?.registerAddress?.pincode}</Text>
        {/* <Text>Mobile No: {proformaDetails.offer.companyId.mobileNo}</Text> */}
        <Text>Buyer Name: {proformaDetails.acceptedBid.user.name}</Text>
        <Text>Buyer Address: {proformaDetails.acceptedBid.user.address}</Text>
        <Text>Buyer GST No: {proformaDetails.acceptedBid.user.gstNo}</Text>
        {/* <Text>Buyer Mobile No: {proformaDetails.acceptedBid.user.mobileNo}</Text> */}
        <Text>Product: {proformaDetails.offer.count}</Text>
        <Text>No. of Bags: {proformaDetails.acceptedBid.noOfBags}</Text>
        <Text>Rate: {proformaDetails.acceptedBid.rate}</Text>
        <Text>Amount: {parseFloat(proformaDetails.acceptedBid.rate) * proformaDetails.acceptedBid.noOfBags || 0}</Text>
        <Text>Freight: {proformaDetails.freight}</Text>
        <Text>Insurance: {proformaDetails.insurance}</Text>
        <Text>CGST: {proformaDetails.cgst}</Text>
        <Text>SGST: {proformaDetails.sgst}</Text>
        <Text>IGST: {proformaDetails.igst}</Text>
        <Text>Total Amount: {
          (parseFloat(proformaDetails.acceptedBid.rate) * proformaDetails.acceptedBid.noOfBags || 0) +
          parseFloat(proformaDetails.freight) +
          parseFloat(proformaDetails.insurance) +
          parseFloat(proformaDetails.cgst) +
          parseFloat(proformaDetails.sgst) +
          parseFloat(proformaDetails.igst)
        }</Text>
      </View>
    </Page>
  </Document>
);

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
});

export default ProformaDocument;

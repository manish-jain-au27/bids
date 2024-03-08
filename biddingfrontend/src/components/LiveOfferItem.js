import React from 'react';
import DashboardLink from './DashboardLink';

const LiveOfferItem = ({ offer }) => {
  return (
    <div className="live-offer-item mb-4 p-4 border rounded">
      <h5 className="mb-3">Count: {offer.count}</h5>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Rate</th>
            <th>No. of Bags</th>
            <th>Delivery Days</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{offer.rate}</td>
            <td>{offer.noOfBags}</td>
            <td>{offer.deliveryDays}</td>
            <td>{offer.time} hours</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default LiveOfferItem;

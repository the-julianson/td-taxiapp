// client/src/components/Rider.js

import React, { useEffect, useState, useMemo } from 'react';
import { Breadcrumb } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';

import { isRider } from '../services/AuthService';
import { getTrips } from '../services/TripService';

import TripCard from './TripCard';

function Rider(props) {
  const [trips, setTrips] = useState([]);

  const getCurrentTrips = useMemo(() => {
    return trips.filter((trip) => {
      return (
        trip.driver !== null &&
        trip.status !== 'REQUESTED' &&
        trip.status !== 'COMPLETED'
      );
    });
  }, [trips]);

  const getCompletedTrips = useMemo(() => {
    return trips.filter((trip) => {
      return trip.status === 'COMPLETED';
    });
  }, [trips]);

  useEffect(() => {
    const loadTrips = async () => {
      const { response, isError } = await getTrips();
      if (isError) {
        setTrips([]);
      } else {
        setTrips(response.data);
      }
    };
    loadTrips();
  }, []);
  if (!isRider()) {
    return <Navigate to="/" />;
  }
  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Dashboard</Breadcrumb.Item>
      </Breadcrumb>
      <TripCard
        title="Current Trip"
        trips={getCurrentTrips}
        group="rider"
        otherGroup="driver"
      />
      <TripCard
        title="Recent Trips"
        trips={getCompletedTrips}
        group="rider"
        otherGroup="driver"
      />
    </>
  );
}

export default Rider;

// client/src/components/Driver.js
import React, { useEffect, useState, useMemo } from 'react';
import { Breadcrumb } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';

import { isDriver } from '../services/AuthService';
import TripCard from './TripCard';
import { getTrips, connect, messages } from '../services/TripService';

function Driver(props) {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    connect();
    const subscription = messages.subscribe((message) => {
      setTrips((prevTrips) => [
        ...prevTrips.filter((trip) => trip.id !== message.data.id),
        message.data,
      ]);
    });
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [setTrips]);

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

  const getCurrentTrips = useMemo(() => {
    return trips.filter((trip) => {
      return trip.driver !== null && trip.status !== 'COMPLETED';
    });
  }, [trips]);

  // new
  const getRequestedTrips = useMemo(() => {
    return trips.filter((trip) => {
      return trip.status === 'REQUESTED';
    });
  }, [trips]);

  // new
  const getCompletedTrips = useMemo(() => {
    return trips.filter((trip) => {
      return trip.status === 'COMPLETED';
    });
  }, [trips]);

  if (!isDriver()) {
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
        group="driver"
        otherGroup="rider"
      />
      <TripCard
        title="Requested Trips"
        trips={getRequestedTrips}
        group="driver"
        otherGroup="rider"
      />
      <TripCard
        title="Recent Trips"
        trips={getCompletedTrips}
        group="driver"
        otherGroup="rider"
      />
    </>
  );
}

export default Driver;

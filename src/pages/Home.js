import React, { useState, useEffect } from "react";
import { collection, orderBy, query, getDocs, where } from "firebase/firestore";
import { db } from "../firebaseConfig";
import AdCard from "../components/AdCard";

const Home = () => {
  const [ads, setAds] = useState([]);
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");

  const getAds = async () => {
    const adsRef = collection(db, "ads");
    let q;
    if (filter !== "" && sort !== "") {
      q = query(adsRef, orderBy("publishedAt", "desc"));
    } else if (filter !== "") {
      q = query(
        adsRef,
        where("category", "==", filter),
        orderBy("publishedAt", "desc")
      );
    } else if (sort === "high") {
      q = query(adsRef, orderBy("price", "desc"));
    } else {
      q = query(adsRef, orderBy("price", "asc"));
    }
    const adDocs = await getDocs(q);
    let ads = [];
    adDocs.forEach((doc) => ads.push({ ...doc.data() }));
    setAds(ads);
  };

  useEffect(() => {
    getAds();
  }, [filter, sort]);

  return (
    <div className="mt-5 container">
      <div className="d-flex justify-content-center justify-content-md-between align-items-center flex-wrap mb-5 form">
        <div>
          <h5>Filter By Category</h5>
          <select
            className="form-select"
            style={{ width: "200px", margin: "auto" }}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="Tablet">Tablet</option>
            <option value="Injection">Injection</option>
            <option value="Syrup">Syrup</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <h5>Sort By</h5>
          <select
            className="form-select"
            style={{ width: "200px", margin: "auto" }}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">Latest</option>
            <option value="high">Price High</option>
            <option value="low">Price Low</option>
          </select>
        </div>
      </div>
      <h3>Recent Listings</h3>
      <div className="row">
        {ads.map((ad) => (
          <div className="col-sm-6 col-md-4 col-xl-3 mb-3" key={ad.adId}>
            <AdCard ad={ad} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

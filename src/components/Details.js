import React, { useState } from "react";
import { RadialChart } from "react-vis";
import FacilityCard from "./FacilityCard";
import SimpleBarChart from "./SimpleBarChart";
import PieCard from "./PieCard";
import FactCard from "./FactCard";
import AssetCategoryCard from "./AssetCategoryCard";
import DetailsSelector from "./DetailsSelector";
import { useFilteredFacilities } from "../hooks/useFacilities";

export default function Details({
    feature,
    onSelectFacility,
    layer,
    tract,
    facilityTypes
}) {
    const [showFacilities, setShowFacilities] = useState(false);
    const [showBoundaryData, setShowBoundaryData] = useState(true);

    const [selectedDetails, setSelectedDetails] = useState("demographics");
    const facilities = useFilteredFacilities(
        feature ? feature.properties.geoid : null,
        layer,
        facilityTypes
    );

    const makeRenting = feature => {
        const properties = feature.properties;
        return [
            { name: "Renters", value: properties.own_vs_rent_rent },
            { name: "Owners", value: properties.own_vs_rent_owner }
        ];
    };

    const featureNames = {
        tracts: "Census Tract",
        cd: "Community District",
        sd: "School District",
        cc: "City Council District",
        nat: "Neighborhood Tablulation Area",
        NOCCs: "NOCC",
        senate_districts: "Senate District",
        police_precincts: "Police Precinct",
        congress_districts: "Congress Assembly District"
    };

    const featureName = featureNames[layer];
    const displayFeature =
        showBoundaryData && layer !== "tracts"
            ? feature
            : tract && {
                  ...tract,
                  properties: {
                      ...tract.properties,
                      geoid: tract.properties.GEOID
                  }
              };
    const makeAgeData = feature => {
        const properties = feature.properties;
        const data = [
            {
                name: "5 years or younger",
                value: properties.age_less_5
            },
            {
                name: "6 yrs - 15 yrs",
                value: properties.age_6_15
            },
            {
                name: "16 yrs - 64 yrs",
                value: properties.age_16_64
            },
            {
                name: "65 yrs or older",
                value: properties.age_64_over
            }
        ];
        return data;
    };
    const makeForeignData = feature => {
        const properties = feature.properties;
        return [
            { name: "US Born", value: properties.foreign_born_native },
            { name: "Foreign Born", value: properties.foreign_born_foreign }
        ];
    };
    const makeEnglishData = feature => {
        const properties = feature.properties;

        return [
            { name: "English", value: properties.english_english },
            { name: "Asian Languages", value: properties.english_asian },
            { name: "Spanish", value: properties.english_spanish },
            { name: "European Languages", value: properties.english_european },
            { name: "Other", value: properties.english_other }
        ];
    };
    const makeInternetData = feature => {
        const properties = feature.properties;
        const data = [
            { name: "No Internet", value: properties.internet_no_access },
            {
                name: "Full Subscription",
                value: properties.internet_subscription
            },
            {
                name: "Limited Subscription",
                value: properties.internet_no_subscription
            }
        ];
        console.log(properties);
        return data;
    };
    const contactStrategy = feature => {
        switch (feature.strategy_code) {
            case 0:
                return "Internet First, English";
            case 1:
                return "Internet First, Bilingual";
            case 2:
                return "Internet Choice, English";
            case 3:
                return "Internet Choice, Bilingual";
        }
    };
    const makeDemographicData = feature => {
        return [
            {
                name: "white",
                value:
                    feature.properties.race_white /
                    feature.properties.race_total
            },
            {
                name: "black",
                value:
                    feature.properties.race_black /
                    feature.properties.race_total
            },
            {
                name: "asian",
                value:
                    feature.properties.race_asian /
                    feature.properties.race_total
            },
            {
                name: "latinx",
                value:
                    feature.properties.race_hispanic /
                    feature.properties.race_total
            },
            {
                name: "other",
                value:
                    feature.properties.race_other /
                    feature.properties.race_total
            }
        ];
    };

    const makeLEP = feature => {
        const cols = [
            "LEPHHs",
            "LEPspanHHs",
            "LEPindoeurHHs",
            "LEPapacHHs",
            "LEPotherHHs"
        ];
        const data = cols.map(col => ({
            value: feature.properties[col],
            title: col
        }));
        return data;
    };

    return displayFeature ? (
        <React.Fragment>
            <div className="overview">
                <div className="boundary-type-selector">
                    {feature && (
                        <div
                            className={`boundary-type-selector-type ${
                                showBoundaryData ? "" : "selected"
                            }`}
                            onClick={() => setShowBoundaryData(true)}
                        >
                            <h2 className={showBoundaryData ? "" : "selected"}>
                                {featureName}: {feature.properties.geoid}
                            </h2>
                        </div>
                    )}
                    {tract && (
                        <div
                            className={`boundary-type-selector-type ${
                                showBoundaryData ? "selected" : ""
                            }`}
                            onClick={() => setShowBoundaryData(false)}
                        >
                            <h2>Census Tract: {tract.properties.GEOID}</h2>
                        </div>
                    )}
                </div>
                <div className="top-stats">
                    {displayFeature && (
                        <p>
                            Population:{" "}
                            <span style={{ color: "red" }}>
                                {Math.floor(
                                    displayFeature.properties.total_population
                                ).toLocaleString()}
                            </span>
                        </p>
                    )}
                    {showBoundaryData && feature ? (
                        <>
                            <p>
                                Population in HTC areas:{" "}
                                <span style={{ color: "red" }}>
                                    {Math.floor(
                                        (feature.properties.htc_pop * 100.0) /
                                            feature.properties.total_population
                                    ).toLocaleString()}
                                    %
                                </span>
                            </p>
                        </>
                    ) : (
                        tract && (
                            <>
                                <p>
                                    Mail return rate 2010:{" "}
                                    <span style={{ color: "red" }}>
                                        {tract.properties.MRR2010}%
                                    </span>
                                </p>
                                <p>
                                    Inital Contact Strategy:{" "}
                                    <span style={{ color: "red" }}>
                                        {contactStrategy(tract.properties)}
                                    </span>
                                </p>
                            </>
                        )
                    )}
                </div>
            </div>
            <div className="selector-cards">
                <DetailsSelector
                    selected={selectedDetails}
                    onSelect={detail => setSelectedDetails(detail)}
                />
                {displayFeature && (
                    <div className="cards">
                        {selectedDetails === "demographics" && (
                            <>
                                <div className="card demographics">
                                    <PieCard
                                        title="Race"
                                        data={makeDemographicData(
                                            displayFeature
                                        )}
                                    />
                                </div>
                                <FactCard
                                    title={""}
                                    facts={[
                                        {
                                            name: "identify as Latinx",
                                            value:
                                                Math.floor(
                                                    (displayFeature.properties
                                                        .race_hispanic *
                                                        100.0) /
                                                        displayFeature
                                                            .properties
                                                            .race_total
                                                ).toLocaleString() + "%"
                                        },
                                        {
                                            name: "identify as Black",
                                            value:
                                                Math.floor(
                                                    (displayFeature.properties
                                                        .race_black *
                                                        100.0) /
                                                        displayFeature
                                                            .properties
                                                            .race_total
                                                ).toLocaleString() + "%"
                                        }
                                    ]}
                                />
                                <div className="card foreign">
                                    <PieCard
                                        title="Foreign Born"
                                        data={makeForeignData(displayFeature)}
                                    />
                                </div>
                                <div className="card age">
                                    <PieCard
                                        title="Age"
                                        data={makeAgeData(displayFeature)}
                                        norm={true}
                                    />
                                </div>
                                <FactCard
                                    title={""}
                                    facts={[
                                        {
                                            name: "people under 5 years old",
                                            value: Math.floor(
                                                displayFeature.properties
                                                    .age_less_5
                                            ).toLocaleString()
                                        }
                                    ]}
                                />
                                <div className="card english_proficency">
                                    <PieCard
                                        title="Limited English Proficency"
                                        data={makeEnglishData(displayFeature)}
                                        norm={true}
                                    />
                                </div>
                            </>
                        )}
                        {selectedDetails === "housing" && (
                            <>
                                <div className="card internet">
                                    <PieCard
                                        title="Internet Access"
                                        data={makeInternetData(displayFeature)}
                                        norm={true}
                                        style={{ width: "500px" }}
                                    />
                                </div>
                                <FactCard
                                    facts={[
                                        {
                                            name:
                                                "people have no internet access",
                                            value: Math.floor(
                                                displayFeature.properties
                                                    .internet_no_access
                                            ).toLocaleString()
                                        }
                                    ]}
                                />
                                <div className="card housing">
                                    <PieCard
                                        title="Housing Tenure"
                                        data={makeRenting(displayFeature)}
                                    />
                                </div>
                            </>
                        )}
                        {selectedDetails === "assets" && (
                            <>
                                {facilityTypes && facilityTypes.length > 0 ? (
                                    facilityTypes.map(type => (
                                        <AssetCategoryCard
                                            title={type}
                                            assets={facilities.filter(
                                                f => f.asset_type === type
                                            )}
                                        />
                                    ))
                                ) : (
                                    <h2>
                                        Turn on some Community Assets to view
                                        here
                                    </h2>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </React.Fragment>
    ) : (
        <div className="placeholder">
            <h2>Click {featureName} for details</h2>
        </div>
    );
}

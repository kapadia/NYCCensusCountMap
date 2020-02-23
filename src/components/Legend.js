import React, { useState } from "react";
import ContactTypeLegend from "./ContactTypeLegend";
import RangeLegend from "./RangeLegend";
import CategoryLegend from "./CategoryLegend";
import BoundarySelector from "./BoundarySelector";
import FacilitiesSelector from "./FacilitiesSelector";
import HelpTab from "./HelpTab";
import InfoTab from "./InfoTab";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faInfoCircle,
    faLayerGroup,
    faQuestionCircle,
    faList
} from "@fortawesome/free-solid-svg-icons";

import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

export default function Legend({
    selectedBoundary,
    boundaries,
    onSelectBoundary,
    showFacilities,
    onShowFacilitiesChange,
    onSelectMetric,
    metric,
    selectedFacilityTypes,
    onSelectFacilityType
}) {
    const [tab, setTab] = useState("layers");
    console.log("Tab is ", tab);
    return (
        <div className="Legend overlay">
            <div className="tabs">
                <div
                    className={tab === "layers" ? "selected" : ""}
                    onClick={() => setTab("layers")}
                >
                    <FontAwesomeIcon icon={faLayerGroup} />
                </div>
                <div
                    className={tab === "info" ? "selected" : ""}
                    onClick={() => setTab("info")}
                >
                    <FontAwesomeIcon icon={faInfoCircle} />
                </div>
                <div
                    className={tab === "questions" ? "selected" : ""}
                    onClick={() => setTab("questions")}
                >
                    <FontAwesomeIcon icon={faQuestionCircle} />
                </div>
            </div>
            <div className="content">
                {tab === "layers" && (
                    <section className="thematic-layer">
                        <h3>Neighborhood Information</h3>
                        <Dropdown
                            options={[
                                {
                                    value: "strategy",
                                    label: "2020 Census Mail Contact Stategies"
                                },
                                {
                                    value: "returnCount",
                                    label: "Hard to Count Populations(2010)"
                                },
                                {
                                    value: "blackPop",
                                    label: "Black Population (%)"
                                },
                                {
                                    value: "latinxPop",
                                    label: "Latinx Population (%)"
                                },
                                {
                                    value: "asianPop",
                                    label: "Asian Population (%)"
                                },
                                {
                                    value: "whitePop",
                                    label: "White Population (%)"
                                },
                                {
                                    value: "otherPop",
                                    label: "Other Population (%)"
                                },
                                {
                                    value: "noInternetPC",
                                    label:
                                        "Population with No Internet Access (%)"
                                },
                                {
                                    value: "englishProficency",
                                    label: "Limited English Proficiency (%)"
                                },
                                {
                                    value: "under5",
                                    label: "Population Under 5 Years Old (%)"
                                }
                            ]}
                            onChange={a => onSelectMetric(a.value)}
                            value={metric}
                            placeholder="Select a metric"
                        />
                        {metric === "strategy" && (
                            <CategoryLegend
                                categories={[
                                    {
                                        color: "#C2A5CF",
                                        name: "Internet First, English"
                                    },
                                    {
                                        color: "#9970AB",
                                        name: "Internet First, Bilingual"
                                    },
                                    {
                                        color: "#A6DBA0",
                                        name: "Internet Choice, English"
                                    },
                                    {
                                        color: "#5AAE61",
                                        name: "Internet Choice, Bilingual"
                                    }
                                ]}
                            />
                        )}
                        {metric === "returnCount" && (
                            <CategoryLegend
                                categories={[
                                    { color: "#b95356", name: "0 - 60%" },
                                    { color: "#ee5658", name: "60 - 65%" },
                                    { color: "#ecbaa8", name: "65 - 70%" },
                                    { color: "#f9bd53", name: "70 - 73%" },
                                    {
                                        color: "rgba(0,0,0,0)",
                                        name: "Not hard to count"
                                    }
                                ]}
                            />
                        )}
                        {metric === "asianPop" && (
                            <RangeLegend
                                name={"Asian Population (%)"}
                                min={"0%"}
                                max={"100%"}
                                colStart={"#FFFFFF"}
                                colEnd={"#8f1158"}
                            />
                        )}
                        {metric === "blackPop" && (
                            <RangeLegend
                                name={"Black Population (%)"}
                                min={"0%"}
                                max={"100%"}
                                colStart={"#FFFFFF"}
                                colEnd={"#b93f22"}
                            />
                        )}
                        {metric === "latinxPop" && (
                            <RangeLegend
                                name={"Latinx Population (%)"}
                                min={"0%"}
                                max={"100%"}
                                colStart={"#FFFFFF"}
                                colEnd={"#cf0621"}
                            />
                        )}
                        {metric === "whitePop" && (
                            <RangeLegend
                                name={"White Population (%)"}
                                min={"0%"}
                                max={"100%"}
                                colStart={"#FFFFFF"}
                                colEnd={"#faaf12"}
                            />
                        )}
                        {metric === "otherPop" && (
                            <RangeLegend
                                name={"Other Population (%)"}
                                min={"0%"}
                                max={"100%"}
                                colStart={"#FFFFFF"}
                                colEnd={"#000000"}
                            />
                        )}
                        {metric === "noInternetPC" && (
                            <RangeLegend
                                name={"% No Internet"}
                                min={"0%"}
                                max={"100%"}
                                colStart={"#FFFFFF"}
                                colEnd={"#faaf12"}
                            />
                        )}
                        {metric === "englishProficency" && (
                            <RangeLegend
                                name={"% Proficent in English"}
                                min={"0%"}
                                max={"100%"}
                                colStart={"#FFFFFF"}
                                colEnd={"#faaf12"}
                            />
                        )}
                        {metric === "under5" && (
                            <RangeLegend
                                name={"% under 5 years old"}
                                min={"0%"}
                                max={"10%"}
                                colStart={"#FFFFFF"}
                                colEnd={"#faaf12"}
                            />
                        )}
                        <BoundarySelector
                            selectedBoundary={selectedBoundary}
                            onSelect={onSelectBoundary}
                            boundaries={boundaries}
                        />
                        <FacilitiesSelector
                            selected={selectedFacilityTypes}
                            onSelected={onSelectFacilityType}
                        />
                    </section>
                )}

                {tab === "info" && <InfoTab />}
                {tab === "questions" && <HelpTab />}
            </div>
        </div>
    );
}

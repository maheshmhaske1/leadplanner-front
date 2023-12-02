import React, { useState, useRef, useEffect } from "react";
import "../styles/bmp.css";
import Map from "../../assets/image/map.png";
import "chart.js/auto";
import axios from "axios";
import {
  CREATE_FOLDER,
  GET_ACADEMY,
  UPDATE_ACADEMY_TABLE2,
  GET_UPDATED_ACADEMY_INFO,
  RESTRICTED_KEYWORDS,
  getDecryptedToken,
} from "../utils/Constants";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProgressBar from "./ProgressBar";
import loadScript from "load-script";
import PlacesAutocomplete from "react-places-autocomplete";
import Dash from "../../assets/image/red-dash.svg";

const BmpOverview = () => {
  const decryptedToken = getDecryptedToken();
  const academyId = localStorage.getItem("academy_id");
  const role_name = localStorage.getItem("role_name");
  const [status, setStatus] = useState(null);
  const [newAcadmeyData, setNewAcadmeyData] = useState(null);
  const [academyData, setAcademyData] = useState({});
  const [phoneNumberCount, setPhoneNumberCount] = useState(1);
  const [academyDataOld, setAcademyDataOld] = useState({});
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [isWhatsappActivated, setIsWhatsappActivated] = useState(true);
  const [alwaysOpenChecked, setAlwaysOpenChecked] = useState(true);
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDays, setSelectedDays] = useState([]);
  const [stateBtn, setStateBtn] = useState(0);
  const [selectedDaysString, setSelectedDaysString] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [updatedFields, setUpdatedFields] = useState([]);
  const [progress, setProgress] = useState(null);
  const [progressArray, setProgressArray] = useState([]);
  const [selectedLanguageName, setSelectedLanguageName] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [mappedLanguages, setMappedLanguages] = useState([]);
  const [languageString, setLanguageString] = useState("");
  const [number, setNumber] = useState(0);
  const [number1, setNumber1] = useState(0);
  const [number2, setNumber2] = useState(0);
  const [number3, setNumber3] = useState(0);
  const [number4, setNumber4] = useState(0);
  let joinLanguage;
  const allowedImageTypes = ["image/jpeg", "image/png", "image/gif"];
  const languages = [
    { value: "Hindi", label: "Hindi" },
    { value: "English", label: "English" },
    { value: "Russian", label: "Russian" },
    { value: "Chinese", label: "Chinese" },
    { value: "Spanish", label: "Spanish" },
    { value: "French", label: "French" },
    { value: "German", label: "German" },
    { value: "Italian", label: "Italian" },
    { value: "Japanese", label: "Japanese" },
    { value: "Korean", label: "Korean" },
    { value: "Portuguese", label: "Portuguese" },
    { value: "Telugu", label: "Telugu" },
    { value: "Kannada", label: "Kannada" },
    { value: "Tamil", label: "Tamil" },
    { value: "Marathi", label: "Marathi" },
    { value: "Bengali", label: "Bengali" },
    { value: "Urdu", label: "Urdu" },
    { value: "Gujarati", label: "Gujarati" },
    { value: "Malayalam", label: "Malayalam" },
    { value: "Punjabi", label: "Punjabi" },
    { value: "Odia", label: "Odia" },
    { value: "Sindhi", label: "Sindhi" },
    { value: "Bhojpuri", label: "Bhojpuri" },
  ];
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [address, setAddress] = useState("");
  const [mapLink, setMapLink] = useState("");
  const [coordinate, setCoordinate] = useState("");
  const [googleScriptLoaded, setGoogleScriptLoaded] = useState(false);
  const [keywords, setKeywords] = useState([
    "murder",
    "kill",
    "killer",
    "kill you",
  ]);
  const updatedAcadmeyInfo = () => {
    axios
      .post(
        GET_UPDATED_ACADEMY_INFO,
        {
          academy_id: academyId,
        },
        {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
          },
        }
      )
      .then((response) => {
        const statusValue = response?.data?.data[0]?.status;
        setStatus(statusValue);

        const rawData = response?.data?.data[0];
        const filteredData = Object.fromEntries(
          Object.entries(rawData).filter(
            ([key, value]) =>
              value !== null &&
              ![
                "creation_date",
                "update_date",
                "status",
                "id",
                "academy_id",
              ].includes(key)
          )
        );
        setNewAcadmeyData(filteredData);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handlelanguageNameChange = (e) => {
    setSelectedLanguageName(e.target.value);
  };

  const handleLevelChange = (e) => {
    setSelectedLevel(e.target.value);
  };

  const handleAddLanguage = () => {
    setStateBtn(1);
    updateField("spoken_languages");
    if (selectedLanguageName && selectedLevel) {
      const newLanguage = {
        language: selectedLanguageName,
        level: selectedLevel,
      };
      setMappedLanguages([...mappedLanguages, newLanguage]);

      // Create a string with all languages and levels
      const languageString = mappedLanguages
        .concat(newLanguage)
        .map((lang) => `${lang.language}(${lang.level})`)
        .join(", ");
      setLanguageString(languageString);
    }
  };

  const handleDeleteLanguage = (index) => {
    setStateBtn(1);
    const updatedLanguages = [...mappedLanguages];
    const newArr = [
      ...updatedLanguages.slice(0, index),
      ...updatedLanguages.slice(index + 1),
    ];
    if (newArr.length === 0) {
      setNumber(1);
    } else {
      setNumber(0);
    }
    setMappedLanguages([...newArr]);

    joinLanguage = newArr
      .map((lang) => `${lang.language}(${lang.level})`)
      .join(", ");
    setLanguageString(joinLanguage);
  };

  useEffect(() => {
    if (!googleScriptLoaded) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAKKzPfrnhLHFG7xMO-snpRQ7ULl91iOQw&libraries=places&language=en&region=IN`;
      script.async = true;
      script.onload = () => setGoogleScriptLoaded(true);
      script.onerror = (error) =>
        console.error("Error loading Google Maps:", error);
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    }
  }, [googleScriptLoaded]);

  const handleSelect = (selectedAddress) => {
    setAddress(selectedAddress);
    if (selectedAddress.length === 0) {
      setNumber2(1);
    } else {
      setNumber2(0);
    }
    setStateBtn(1);

    const placesService = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );

    placesService.textSearch({ query: selectedAddress }, (results, status) => {
      if (
        status === window.google.maps.places.PlacesServiceStatus.OK &&
        results.length > 0
      ) {
        const location = results[0].geometry.location;
        const selectedLatitude = location.lat();
        const selectedLongitude = location.lng();
        setCoordinate(`${selectedLatitude},${selectedLongitude}`);

        if (`${selectedLatitude},${selectedLongitude}`.length === 0) {
          setNumber4(1);
        } else {
          setNumber4(0);
        }

        updateField("coordinate");
      }
    });

    const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURI(
      selectedAddress
    )}`;
    setMapLink(mapLink);
    if (mapLink.length === 0) {
      setNumber3(1);
    } else {
      setNumber3(0);
    }
    updateField("map");
  };

  const updateField = (fieldName) => {
    if (!updatedFields.includes(fieldName)) {
      setUpdatedFields([...updatedFields, fieldName]);
    }
  };

  const handleCheckboxChange = (event) => {
    const { checked } = event.target;
    setIsWhatsappActivated(checked);

    if (checked) {
      setPhoneNumberCount(1);
      setIsButtonVisible(true);
    }
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hours = 0; hours < 24; hours++) {
      for (let minutes = 0; minutes < 60; minutes += 30) {
        const hour = hours < 10 ? `0${hours}` : `${hours}`;
        const minute = minutes === 0 ? "00" : `${minutes}`;
        const time = `${hour}:${minute}`;
        options.push(time);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  const handleTimeChange = (event) => {
    setSelectedStartTime(event.target.value);
    updateField("timing");
    setStateBtn(1);
  };
  const handleEndTimeChange = (event) => {
    setSelectedEndTime(event.target.value);
    updateField("timing");
    setStateBtn(1);
  };

  const academyDetails = () => {
    axios
      .get(GET_ACADEMY + academyId, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      })
      .then((response) => {
        setSelectedLanguage(response?.data?.data[0]?.spoken_languages);
        setAcademyData(response?.data?.data[0]);
        setAcademyDataOld(response?.data?.data[0]);
        setAddress(response?.data?.data[0]?.address1 || "");
        setProgress(response?.data?.data[0]?.completion_percentage);

        const languages =
          response?.data?.data[0]?.spoken_languages?.split(", ");

        const newLanguage = languages.map((lang) => {
          const [language, level] = lang.split("(");
          return {
            language: language.trim(),
            level: level.substring(0, level.length - 1).trim(),
          };
        });

        setMappedLanguages([...newLanguage]);

        if (
          response?.data?.data[0]?.completion_percentage !== "" &&
          response?.data?.data[0]?.completion_percentage !== null
        ) {
          setProgressArray(
            response?.data?.data[0]?.completion_percentage.split(",")
          );
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };
  //   const getAllKeywords = () => {
  //     axios.get(RESTRICTED_KEYWORDS, {
  //       headers: {
  //         Authorization: `Bearer ${decryptedToken}`,
  //       },
  //     })
  //     .then((response) => {
  //       const newKeywords = response?.data?.data.map(keywordObj => keywordObj.keyword);
  //       setKeywords(newKeywords);
  //     })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   }
  // console.log(keywords);
  
  useEffect(() => {
    academyDetails();
    updatedAcadmeyInfo();
    // getAllKeywords();
  }, []);
  
  useEffect(() => {
    if (academyData && academyData.timing) {
      if (academyData.timing === "Always_open") {
        setAlwaysOpenChecked(true);
      } else {
        const timingParts = academyData.timing.split(" to ");
        if (timingParts.length === 2) {
          const [startTime, endTime] = timingParts;
          setAlwaysOpenChecked(false);
          setSelectedStartTime(startTime);
          setSelectedEndTime(endTime);
        }
      }
    }
  }, [academyData]);
  useEffect(() => {
    if (!googleScriptLoaded) {
      loadScript(
        "https://maps.googleapis.com/maps/api/js?key=AIzaSyAKKzPfrnhLHFG7xMO-snpRQ7ULl91iOQw&libraries=places&language=en&region=IN",
        (error, script) => {
          if (error) {
            console.error("Error loading Google Maps JavaScript API:", error);
          } else {
            setGoogleScriptLoaded(true);
          }
          return <div>Loading Google Maps...</div>;
        }
      );
    }
  }, [googleScriptLoaded]);

  const processImageName = (imageName) => {
    const nameParts = imageName.split(".");
    if (nameParts.length > 1) {
      const namePart = nameParts.slice(0, -1).join(".");
      const processedName = namePart.replace(/[^\w-]/g, "-");
      return `${processedName}.${nameParts[nameParts.length - 1]}`;
    } else {
      return imageName.replace(/[^\w-]/g, "-");
    }
  };

  const handleFileChange = (event) => {
    setStateBtn(1);
    const selectedImage = event.target.files[0];
    if (selectedImage) {
      if (!allowedImageTypes.includes(selectedImage.type)) {
        alert("Please choose a valid image file (JPEG, PNG, GIF).");
        return;
      }
      submitImage(event.target.files[0]);
    }
  };
  const submitImage = (file) => {
    const selectedImage = file;
    if (selectedImage) {
      if (selectedImage.size > 2 * 1024 * 1024) {
        alert(
          "Image size should be less than 2MB. Please choose a smaller image."
        );
        return;
      }
      const folder = "bookmyplayer/academy/" + academyId;
      const imageNameWithoutExtension = selectedImage.name.replace(
        /\.[^/.]+$/,
        ""
      );
      const sanitizedImageName = imageNameWithoutExtension.replace(
        /[^\w-]/g,
        "-"
      );
      const uniqueFileName = `${folder}/${sanitizedImageName}`;
      const data = new FormData();
      data.append("file", selectedImage);
      data.append("upload_preset", "zbxquqvw");
      data.append("cloud_name", "cloud2cdn");
      data.append("public_id", uniqueFileName);
      setIsUploading(true);
      fetch("https://api.cloudinary.com/v1_1/cloud2cdn/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setSelectedFile(selectedImage);
          updateField("logo");
          setFileName(processImageName(selectedImage.name));
          if (processImageName(selectedImage.name).length === 0) {
            setNumber1(1);
          } else {
            setNumber1(0);
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsUploading(false);
        });
    }
  };

  function handleChange(event) {
    const { name, value } = event.target;
    let redText = false;
    let disableSaveButton = false;
    const words = value.split(" ");
    let textRestrict = "";
    words.forEach((word) => {
      if (keywords.includes(word?.toLowerCase())) {
        textRestrict = word;
        redText = true;
        disableSaveButton = true;
      }
    });
    if (redText) {
      alert(`Warning: The word "${textRestrict}" is a restricted keyword.`);
      event.target.style.color = "red";
    } else {
      event.target.style.color = "";
    }
    if (academyData[name] !== value) {
      setStateBtn(disableSaveButton ? 0 : 1);
      updateField(name);
    }
    setAcademyData({ ...academyData, [name]: value });
  }

  const handleDayClick = (day) => {
    setStateBtn(1);
    if (selectedDays?.includes(day)) {
      setSelectedDays(
        selectedDays.filter((selectedDay) => selectedDay !== day)
      );
      updateField("sport");
    } else {
      setSelectedDays([...selectedDays, day]);
      updateField("sport");
    }
  };

  useEffect(() => {
    setSelectedDaysString(selectedDays.join(","));
  }, [selectedDays]);

  useEffect(() => {
    setSelectedDays(academyData?.sport?.split(",") || []);
  }, [academyData]);

  const handleButtonClick = (event) => {
    event.preventDefault();
    fileInputRef.current.click();
  };

  const handleAlwaysOpenCheckboxChange = () => {
    setAlwaysOpenChecked(!alwaysOpenChecked);
    setStateBtn(1);
  };

  const addPhoneNumberInput = () => {
    setIsWhatsappActivated(false); // Uncheck the checkbox
    setPhoneNumberCount(phoneNumberCount + 1);
    setIsButtonVisible(false);
  };

  const startAndEndTime = alwaysOpenChecked
    ? "Always_open"
    : `${selectedStartTime} to ${selectedEndTime}`;
console.log(newAcadmeyData);
  function handleSubmit(event) {
    event.preventDefault();
    if (!progressArray?.includes("1")) {
      progressArray.push("1");
      setProgressArray(progressArray);
    }
    const combinedProgress = progressArray?.join(",");

    const sportsChanged =
      selectedDaysString?.replace(/^,+/g, "") !== academyData?.sport;

    const spokenLanguagesChanged =
      languageString !== academyData?.spoken_languages;


    const addressChanged = address !== academyData?.address1;
    const maplinkChanged = mapLink !== academyData?.map;
    const coordinateChanged = coordinate !== academyData?.coordinate;

    const timingChanged = startAndEndTime !== academyData?.timing;

    const logoChanged = fileName !== academyData?.fileName;

    const progressChanged =
      combinedProgress !== academyData?.completion_percentage;
    const updatedFormData = {};
    const hasChanged = (field) =>
      academyData?.[field] !== academyDataOld?.[field];

    if (hasChanged("name")) {
      updatedFormData.name = academyData.name;
    }
    if (hasChanged("about")) {
      updatedFormData.about = academyData.about;
    }

    if (hasChanged("phone")) {
      updatedFormData.phone = academyData.phone;
    }

    if (hasChanged("whatsapp")) {
      updatedFormData.whatsapp = academyData.whatsapp;
    }

    if (hasChanged("experience")) {
      updatedFormData.experience = academyData.experience;
    }

    if (hasChanged("facebook")) {
      updatedFormData.facebook = academyData.facebook;
    }

    if (hasChanged("instagram")) {
      updatedFormData.instagram = academyData.instagram;
    }

    if (hasChanged("website")) {
      updatedFormData.website = academyData.website;
    }

    if (hasChanged("email")) {
      updatedFormData.email = academyData.email;
    }

    if (hasChanged("timing")) {
      updatedFormData.timing = startAndEndTime;
    }

    if (spokenLanguagesChanged && languageString !== "") {
      updatedFormData.spoken_languages = languageString;
    }

    if (number === 1) {
      updatedFormData.spoken_languages = languageString;
    }

    if (sportsChanged) {
      updatedFormData.sport = selectedDaysString?.replace(/^,+/g, "");
    }
    if (timingChanged) {
      updatedFormData.timing = startAndEndTime;
    }

    if (logoChanged && fileName !== "") {
      updatedFormData.logo = fileName;
    }

    if (progressChanged && combinedProgress !== "") {
      updatedFormData.completion_percentage = combinedProgress;
    }

    if (number1 === 1) {
      updatedFormData.logo = fileName;
    }

    if (addressChanged && address !== "") {
      updatedFormData.address1 = address;
    }
    if (maplinkChanged && mapLink !== "") {
      updatedFormData.map = mapLink;
    }
    if (coordinateChanged && coordinate !== "") {
      updatedFormData.coordinate = coordinate;
    }

    if (number2 === 1) {
      updatedFormData.address1 = address;
    }
    if (number3 === 1) {
      updatedFormData.map = mapLink;
    }
    if (number4 === 1) {
      updatedFormData.coordinate = coordinate;
    }

    updatedFormData.academy_id = academyId;

    if (newAcadmeyData !== null) {
      Object.keys(newAcadmeyData).forEach((key) => {
        if (!updatedFormData.hasOwnProperty(key)) {
          updatedFormData[key] = newAcadmeyData[key];
        }
      });
    }
    console.log(updatedFormData);
    console.log("update body");

    axios
      .post(UPDATE_ACADEMY_TABLE2, updatedFormData, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`, // Include the JWT token in the Authorization header
        },
      })
      .then((response) => {
        if (response.data.status === 1) {
          toast.success("Details updated successfully", {
            position: "top-center",
            autoClose: 2000,
          });
        } else {
          toast.error("Some Error Occurred", {
            position: "top-center",
            autoClose: 2000,
          });
        }
        academyDetails();
      })
      .catch((error) => {
        console.log(error);
        toast.error("An error occurred while updating details", {
          position: "top-center",
          autoClose: 2000,
        });
      })
      .finally(() => {
        setStateBtn(0);
      });
  }

  return (
    <>
      <div className="bmp-container">
        <div>
          <p className="common-fonts bmp-top">Address & Contact details</p>

          <div className="bmp-input-flex">
            <label htmlFor="" className="common-fonts bmp-academy-name">
              Academy name
            </label>
            <input
              type="text"
              className="common-fonts common-input bmp-input"
              name="name"
              onChange={handleChange}
              value={isLoading ? "-" : academyData?.name || ""}
              disabled={status === 0 && role_name === 'Academy'}
            />
          </div>
          <div className="bmp-input-flex">
            <label htmlFor="" className="common-fonts bmp-academy-name">
              Introduction
            </label>
            <textarea
              name="about"
              onChange={handleChange}
              value={isLoading ? "-" : academyData?.about || ""}
              id=""
              className="common-fonts bmp-textarea"
              rows="2"
              disabled={status === 0 && role_name === 'Academy'}
            ></textarea>
          </div>
          <div className="bmp-input-flex">
            <label htmlFor="" className="common-fonts bmp-academy-name">
              Address
            </label>
            {googleScriptLoaded && (
              <PlacesAutocomplete
                value={address}
                onChange={setAddress}
                onSelect={handleSelect}
                searchOptions={{
                  componentRestrictions: { country: "IN" },
                }}
              >
                {({
                  getInputProps,
                  suggestions,
                  getSuggestionItemProps,
                  loading,
                }) => (
                  <div className="relativeInput">
                    <input
                      type="text"
                      className="common-fonts common-input bmp-input "
                      disabled={status === 0 && role_name === 'Academy'}
                      {...getInputProps({
                        placeholder: "Enter your address",
                      })}
                    />
                    <div
                      {...(suggestions.length > 0
                        ? { className: "autocomplete-dropdown" }
                        : {})}
                    >
                      {loading && <div>Loading...</div>}
                      {suggestions.map((suggestion) => (
                        <div
                          {...getSuggestionItemProps(suggestion)}
                          key={suggestion.placeId}
                        >
                          {suggestion.description}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </PlacesAutocomplete>
            )}
          </div>
          <div className="bmp-input-flex">
            <label htmlFor="" className="common-fonts bmp-academy-name">
              Select your sport
            </label>
            <div className="bmp-games">
              <div
                className={`common-fonts bmp-game-list ${
                  selectedDays?.includes("Football") ? "bmp-game-active" : ""
                }`}
                onClick={() => handleDayClick("Football")}
              >
                Football
              </div>
              <div
                className={`common-fonts bmp-game-list ${
                  selectedDays?.includes("Basketball") ? "bmp-game-active" : ""
                }`}
                onClick={() => handleDayClick("Basketball")}
              >
                Basketball
              </div>
              <div
                className={`common-fonts bmp-game-list ${
                  selectedDays?.includes("Chess") ? "bmp-game-active" : ""
                }`}
                onClick={() => handleDayClick("Chess")}
              >
                Chess
              </div>
              <div
                className={`common-fonts bmp-game-list ${
                  selectedDays?.includes("Tennis") ? "bmp-game-active" : ""
                }`}
                onClick={() => handleDayClick("Tennis")}
              >
                Tennis
              </div>
              <div
                className={`common-fonts bmp-game-list ${
                  selectedDays?.includes("MMA") ? "bmp-game-active" : ""
                }`}
                onClick={() => handleDayClick("MMA")}
              >
                MMA
              </div>
              <div
                className={`common-fonts bmp-game-list ${
                  selectedDays?.includes("Golf") ? "bmp-game-active" : ""
                }`}
                onClick={() => handleDayClick("Golf")}
              >
                Golf
              </div>
              <div
                className={`common-fonts bmp-game-list ${
                  selectedDays?.includes("Hockey") ? "bmp-game-active" : ""
                }`}
                onClick={() => handleDayClick("Hockey")}
              >
                Hockey
              </div>
              <div
                className={`common-fonts bmp-game-list ${
                  selectedDays?.includes("Badminton") ? "bmp-game-active" : ""
                }`}
                onClick={() => handleDayClick("Badminton")}
              >
                Badminton
              </div>
              <div
                className={`common-fonts bmp-game-list ${
                  selectedDays?.includes("Volleyball") ? "bmp-game-active" : ""
                }`}
                onClick={() => handleDayClick("Volleyball")}
              >
                Volleyball
              </div>
            </div>
          </div>
          {[...Array(phoneNumberCount)].map((_, index) => (
            <div className="bmp-input-flex" key={index}>
              <div className="bmp-phone-field">
                <label htmlFor="" className="common-fonts bmp-academy-name">
                  {index === 0 ? "Phone Number" : `Whatsapp Number`}
                </label>

                {index === 0 && ( // Render checkbox and label only for the first phone number input
                  <div className="bmp-whatsapp-check">
                    <label className="custom-checkbox">
                      <input
                        type="checkbox"
                        className="cb1"
                        name="headerCheckBox"
                        checked={isWhatsappActivated}
                        onChange={handleCheckboxChange}
                        disabled={status === 0 && role_name === 'Academy'}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <p className="common-fonts light-color">
                      Whatsapp Activated
                    </p>
                  </div>
                )}
              </div>

              <input
                type="number"
                className="common-fonts common-input bmp-input"
                name={index === 0 ? "phone" : "whatsapp"}
                disabled={status === 0 && role_name === 'Academy'}
                onChange={handleChange}
                value={
                  isLoading
                    ? "-"
                    : index === 0
                    ? academyData?.phone
                    : academyData?.whatsapp
                }
              />
            </div>
          ))}

          {isButtonVisible && (
            <div>
              <button
                className="common-fonts common-white-blue-button bmp-add-phone"
                onClick={addPhoneNumberInput}
                disabled={status === 0 && role_name === 'Academy'}
              >
                + Add Phone Number
              </button>
            </div>
          )}

          <div className="bmp-input-flex">
            <label htmlFor="" className="common-fonts bmp-academy-name">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="common-fonts common-input bmp-input"
              onChange={handleChange}
              value={isLoading ? "-" : academyData?.email || ""}
              style={{ textTransform: "none" }}
              disabled={status === 0 && role_name === 'Academy'}
            />
          </div>
          <div className="bmp-input-flex">
            <label htmlFor="" className="common-fonts bmp-academy-name">
              Website
            </label>
            <input
              type="text"
              name="website"
              onChange={handleChange}
              value={isLoading ? "-" : academyData?.website || ""}
              className="common-fonts common-input bmp-input"
              disabled={status === 0 && role_name === 'Academy'}
            />
          </div>

          <div className="bmp-input-flex">
            <label className="common-fonts bmp-academy-name">
              Experience:{" "}
            </label>
            <select
              className="common-fonts common-input langSelect"
              name="experience"
              onChange={handleChange}
              disabled={status === 0 && role_name === 'Academy'}
            >
              <option value="">Select Experience</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12">12</option>
              <option value="13">13</option>
              <option value="14">14</option>
              <option value="15">15</option>
              <option value="16">16</option>
              <option value="17">17</option>
              <option value="18">18</option>
              <option value="19">19</option>
              <option value="20">20</option>
              <option value="20+">20+</option>
            </select>
          </div>

          <div className="bmp-input-flex bmp-last-time">
            <div className="bmp-phone-field">
              <label htmlFor="" className="common-fonts bmp-academy-name">
                Open Timings
              </label>
              <div className="bmp-whatsapp-check">
                <label className="custom-checkbox">
                  <input
                    type="checkbox"
                    className="cb1"
                    name="headerCheckBox"
                    checked={alwaysOpenChecked}
                    onChange={handleAlwaysOpenCheckboxChange}
                    disabled={status === 0 && role_name === 'Academy'}
                  />
                  <span className="checkmark"></span>
                </label>
                <p className="common-fonts light-color">Always Open</p>
              </div>
            </div>

            {!alwaysOpenChecked && (
              <div className="bmp-input-flex-2 bmp-add-fields bmp-new-timing">
                <select
                  className="common-fonts common-input bmp-modal-select-2 overviewTime"
                  value={selectedStartTime}
                  onChange={handleTimeChange}
                >
                  <option value="">Select Opening time</option>
                  {timeOptions.map((time, index) => (
                    <option key={index} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                <p className="common-fonts light-color bmp-to">To</p>
                <select
                  className="common-fonts common-input bmp-modal-select-2 overviewTime"
                  value={selectedEndTime}
                  onChange={handleEndTimeChange}
                >
                  <option value="">Select closing time</option>
                  {timeOptions.map((time, index) => (
                    <option key={index} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        <div>
          <ProgressBar array={progressArray} />
          <div className="bmp-right-fields">
            <p className="common-fonts">Upload Academic Logo</p>
            <p className="common-fonts">Recommended image size 190x190</p>

            <div className="bmp-upload">
              <div className="contact-browse deal-doc-file">
                <span
                  className="common-fonts common-input contact-tab-input"
                  style={{
                    position: "relative",
                    marginRight: "10px",
                  }}
                >
                  <button
                    className="contact-browse-btn common-fonts"
                    onClick={handleButtonClick}
                    disabled={status === 0 && role_name === 'Academy'}
                  >
                    Browse
                  </button>

                  <input
                    type="file"
                    style={{
                      display: "none",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      width: "100%",
                    }}
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  {isUploading ? (
                    <span className="common-fonts upload-file-name">
                      Uploading...
                    </span>
                  ) : (
                    <span className="common-fonts upload-file-name">
                      {fileName ? fileName : academyData?.logo}
                      {}
                    </span>
                  )}
                </span>
              </div>

              {selectedFile && (
                <div className="bmp-image-preview">
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Selected Preview"
                    className="bmp-preview-image"
                  />
                </div>
              )}

              {!selectedFile && (
                <div className="bmp-image-preview">
                  <img
                    src={`https://res.cloudinary.com/cloud2cdn/image/upload/bookmyplayer/academy/${academyId}/${academyData?.logo}`}
                    alt=""
                    className="bmp-preview-image"
                  />
                </div>
              )}
            </div>

            <p className="common-fonts bmp-social">
              Connect Social Media Account
            </p>

            <div className="bmp-input-flex">
              <label htmlFor="" className="common-fonts bmp-academy-name">
                Facebook
              </label>
              <input
                type="text"
                className="common-fonts common-input bmp-input"
                name="facebook"
                onChange={handleChange}
                value={isLoading ? "-" : academyData?.facebook || ""}
                disabled={status === 0 && role_name === 'Academy'}
              />
            </div>
            {/* <div className="bmp-input-flex">
              <label htmlFor="" className="common-fonts bmp-academy-name">
                Twitter
              </label>
              <input
                type="text"
                className="common-fonts common-input bmp-input"
              />
            </div> */}
            <div className="bmp-input-flex">
              <label htmlFor="" className="common-fonts bmp-academy-name">
                Instagram
              </label>
              <input
                type="text"
                className="common-fonts common-input bmp-input"
                name="instagram"
                onChange={handleChange}
                value={isLoading ? "-" : academyData?.instagram || ""}
                disabled={status === 0 && role_name === 'Academy'}
              />
            </div>

            <div className="bmp_overview_language_flex">
              <p className="common-fonts bmp-social">Language</p>

              <button
                className="common-white-blue-button"
                onClick={handleAddLanguage}
                disabled={status === 0 && role_name === 'Academy'}
              >
                + Add Language
              </button>
            </div>

            <div className="bmp-input-flex bmp_language_box">
              <div>
                <label className="common-fonts bmp-academy-name">
                  Language
                </label>
                <select
                  value={selectedLanguageName}
                  onChange={handlelanguageNameChange}
                  className="common-fonts common-input langSelect level_input"
                  disabled={status === 0 && role_name === 'Academy'}
                >
                  <option value="">Select your language</option>
                  {languages.map((language) => (
                    <option key={language.value} value={language.value}>
                      {language.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="common-fonts bmp-academy-name">Level</label>
                <select
                  value={selectedLevel}
                  onChange={handleLevelChange}
                  className="common-fonts common-input langSelect level_input"
                  disabled={status === 0 && role_name === 'Academy'}
                >
                  <option value="">Select your Level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Mastery">Mastery</option>
                </select>
              </div>
            </div>

            {mappedLanguages.map((mappedLanguage, index) => (
              <div className="bmp_overview_language_map" key={index}>
                <p className="common-fonts">
                  {mappedLanguage.language} ({mappedLanguage.level})
                </p>
                <img src={Dash} alt="" onClick={handleDeleteLanguage} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bmp-bottom-btn">
        <button className="common-fonts common-white-button">cancel</button>
        {/* <button className="common-save-button common-save">Save</button> */}
        {stateBtn === 0 ? (
          <button disabled className="disabledBtn">
            Save
          </button>
        ) : (
          <button
            className="common-save-button common-save"
            onClick={handleSubmit}
          >
            Save
          </button>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default BmpOverview;

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";

const secretKey = "mySecretKey123";

function Testing() {
  const { auth } = useParams();
  const [authData, setAuthData] = useState();
  const [isLoading, setIsLoading] = useState(true); // New loading state
  const navigate = useNavigate();
  // http://core.leadplaner.com/auth=QhUjSgsdCBFvQRxIeFsPPjAMLBsvPR4fMAB8WiQKGgsxRwY3AlMwWkJrOzoZXE0XHD47Pzp4BH4-DjoGDksWLhgsT3xhRAQaPlwQKDNNPjwuAF56BxY6PDQgERUcURB9cXkdIAs0Cj0PMXkqLVZLfDkoKis3IxY9JjNNUnF6WzQHPFY9MTF6Kj14A30lSX02Li1QFzgKSwRrXh0pOTMKJDYxGAoeZQZ6DxAiVC4WU0MRJxNbUAQDF2s0R1ZKGDtKFVRTV0FWPxVMGgoZLklWXUIcABg6CU9dCQRkBhZfRlIODSBJTB4VWy8AGF1BH0IVI0oQFxEAIgseQh4cAQl8FgYGER0lAgoeUF8CHnwEBxZJWycVVkJXRxkQPQIQXQcYJAJWR1tWGlV8CRNdFhE_ERBfVUBCGDAGBgEWOSoLGFZXXggXJ0lMHhVbOAANRVtdCgp8FgoGACQqAhxCHVIJHX9KDwJKBy4RDVhcVB5WOwAPAjYRKBEQXlwcDB03SUweFVs4AA1FW10KCnwNBh4VJy4GDVhdXUIMIwECBgBYZAkJHkFWGQ06CwQBSgE4AAt8U10MHjYIBhwRWyoBHR0dXx1WIAAXBgwaLBZWREFWHzQyCwIVABkuCw0eR0MJGCcAT10JBGQWHEVGWgMeIEoRFxUbOREKcFxXLBcyCRoGDBc4SVZdQhweHCcRChwCB2QIGEJGVh8qNhEXGwsTOEo6WEZKQVY_FUwBAAA_DBdWQRweACARBh9KBz8EDVQeHAEJfBYGBhEdJQIKHlVWAxwhBA9eShg7SgpURkcEFzQWTBwKACIDEFJTRwQWPUlMHhVbOAANRVtdCgp8EBAXFxo_ABhcQR9CFSNKEBcRACILHkIdUAIUIwQNCxYRPxEQX1VAQVY_FUwBAAA_DBdWQRwfHDAcAB4AFiILVR5eQ0IKNhEXGwsTOEoJQ1tFDBoqJgwcBhElEVUeXkNCCjYRFxsLEzhKClRGRwQXNCkGEwEHZ0oVQR1ACA0nDA0VFls4AA1FW10KPTYED15KGDtKClRGRwQXNBZMAQAAPwwXVmdADB42SUweFVs4AA1FW10KCnwWBgYRHSUCMFxCdhUJf0oPAkoHLhENWFxUHlYgDBcXNRUsAAoeRFoIDn9KDwJKBy4RDVhcVB5WJAoRGQMYJBJVHl5DQhs-FU9dCQRkBxRBHVwbHCETChcSWGQJCR5QXh1WNQAGAUlbJxVWU19DQg0hBAocDBosSVZdQhwPFCNKBBMJGC4XAB0dXx1WIAAXBgwaLBZWR1tWGikhCgUbCRFkABRBXlwUHDY1ER0DHScAVR5eQ0IKNhEXGwsTOEoPWFdEPQs8AwoeAFs_DBRUYVsIHCdJTB4VWzgADUVbXQoKfBMKFxIkOQofWF5WQh08BhYfABo_FlUeXkNCCjYRFxsLEzhKD1hXRD0LPAMKHgBbOAQVUEBKPhU6FU9dCQRkFhxFRloDHiBKFRsAAxsXFldbXwhWNggTHgoNLgApQ11VBBU2SUweFVs4AA1FW10KCnwTChcSJDkKH1heVkINOggGIQ0RLhFVHl5DQgo2ERcbCxM4Sg9YV0Q9CzwDCh4AWy8KGkRfVgMNIElMHhVbb0EYVV9aA113VA
  // http://core.leadplaner.com/auth=QhUjSgEfFVskExxDRFoIDndBBgsvHCkiGlh9WicwBh8qQysdAhYwX2AGDjoaUyoZFSwdJjMIHFYUMyM_IDtTOSEkCnhccQIbYVAPOw8bIiotUkp-ORJmKDc3UTsYLAp4XGFYGhQwCj0MPgk8S3dZaTpIZiwKBQwQAwkOa2QKHSMQLFU_DAMiBC53AnoHFisrGTMSOh88S352fl81EC8PFy01IioTdAF-KTxjKBkzUTkxP0AfBHAeHSU0AAsnGHIgGwRmYzsNBw0zRzQQOCBAVl1kMhphLBo8SD4BERAIaxdJVj8VTBAIBGdKFUEdUQAJfAMGFxZYZAkJHlBeHVYnFwIbCx0lAlUeXkNCGz4VTBUEGCcAC0geHAEJfAcOAkoGLhMQVEVAQVY_FUwQCARkCRxQVkBBVj8VTBAIBGQWDEFCXB8Nf0oPAkoWJhVWWVdfHV13JAATAREmHF0VAANJXWdUUA
  // 
  useEffect(() => {
    const encryptedToken = localStorage.getItem("jwtToken");
    if (encryptedToken) {
      const landingUrl = localStorage.getItem("landingUrl");
      navigate(landingUrl);
    } else {
      setIsLoading(false); // Set loading state to false if token not found
    }
  }, [navigate]);

  useEffect(() => {
    function customDecrypt(encryptedData, key) {
      if (!encryptedData) return "";

      var encodedData = encryptedData.slice(5);
      encodedData = encodedData.replace(/-/g, "+").replace(/_/g, "/");
      encodedData = encodedData
        .replace(/dot/g, "$")
        .replace(/at/g, "@")
        .replace(/hash/g, "#");
      var decodedData = atob(encodedData); // Use atob function to decode base64
      var decrypted = "";
      for (var i = 0; i < decodedData.length; i++) {
        decrypted += String.fromCharCode(
          decodedData.charCodeAt(i) ^ key.charCodeAt(i % key.length)
        );
      }
      return decrypted;
    }

    function decryptAuthData() {
      if (auth) {
        var decryptedText = customDecrypt(auth, secretKey);
        setAuthData(decryptedText);
        let auth0 = decryptedText.split("$$");
        console.log(auth0)
        const token = auth0[1];
        const roleName = auth0[3];
        const id = auth0[4];
        localStorage.setItem("role_name", roleName);
        localStorage.setItem("id", id);
        const encryptedToken = CryptoJS.AES.encrypt(
          token,
          secretKey
        ).toString();
        localStorage.setItem("jwtToken", encryptedToken);
        if (auth0[5] !== "") {
          localStorage.setItem("academy_id", auth0[5]);
        }
        const landingUrl = auth0[0];
        localStorage.setItem("landingUrl", landingUrl);
        const userPath = auth0[2].split(",");
        userPath.push(landingUrl);
        const userPathTot = userPath.join(",");
        const encryptedUserPathTot = CryptoJS.AES.encrypt(
          userPathTot,
          secretKey
        ).toString();
        localStorage.setItem("encryptedUserPathTot", encryptedUserPathTot);
        navigate(landingUrl);
      }
    }

    decryptAuthData();
  }, [auth, navigate]);

  if (isLoading) {
    return null; // Render nothing while loading
  }

  return (
    <div>
      <p className="welcome-center">Welcome</p>
    </div>
  );
}

export default Testing;

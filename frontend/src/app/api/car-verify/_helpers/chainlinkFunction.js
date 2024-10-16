const verifyCarDetails = async (vin, make, model, year) => {
  const apiUrl = `https://car-verification-api.vercel.app/verify?vin=${vin}&make=${make}&model=${model}&year=${year}`;

  const response = await Functions.makeHttpRequest({
    url: apiUrl,
    method: "GET",
  });

  if (response.error) {
    throw Error("API request failed");
  }

  const { isVerified } = response.data;

  return Functions.encodeString(isVerified.toString());
};

return verifyCarDetails(args[0], args[1], args[2], args[3]);

type WeatherData = {
    rainfall: {
      data: RainfallData[];
      startTime: string;
      endTime: string;
    };
    warningMessage: string[];
    icon: number[];
    iconUpdateTime: string;
    uvindex: {
      data: UvindexData[];
      recordDesc: string;
    };
    updateTime: string;
    temperature: {
      data:TemperatureData[];
      recordTime: string;
    };
    tcmessage: string;
    mintempFrom00To09: string;
    rainfallFrom00To12: string;
    rainfallLastMonth: string;
    rainfallJanuaryToLastMonth: string;
    humidity: {
      recordTime: string;
      data: HumidityData[];
    };
  }

  type RainfallData ={
    unit: string;
    place: string;
    max: number;
    main: string | boolean;
  }

  type UvindexData = {
    place: string;
    value: number;
    desc: string;
  }

  type TemperatureData = {
    place: string;
    value: number;
    unit: string;
  }
  type HumidityData = {
    unit: string;
    value: number;
    place: string;
  }

  type CurrentLocationWeatherData = {
    name: string;
    humidityData: HumidityData;
    temperatureData: TemperatureData;
  }
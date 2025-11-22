class EmissionCalculator:
    @staticmethod
    def calculate_emissions(energy_kwh: float, carbon_intensity_gco2_kwh: float) -> float:
        """
        Calculates total emissions in gCO2.
        """
        return energy_kwh * carbon_intensity_gco2_kwh

emission_calculator = EmissionCalculator()

import { act, renderHook, waitFor } from "@testing-library/react";
import { useDeliveryLocation } from "@/lib/hooks/useDeliveryLocation";

type GeoSuccess = (position: { coords: { latitude: number; longitude: number } }) => void;
type GeoError = (error: { code: number; message: string }) => void;

const FALLBACK_LOCATION = { city: "New York", country: "United States" };

describe("useDeliveryLocation", () => {
  const originalGeolocation = global.navigator.geolocation;

  afterEach(() => {
    Object.defineProperty(global.navigator, "geolocation", {
      value: originalGeolocation,
      configurable: true,
    });
    jest.restoreAllMocks();
  });

  it("sets status to error when geolocation is not supported", async () => {
    Object.defineProperty(global.navigator, "geolocation", {
      value: undefined,
      configurable: true,
    });

    const { result } = renderHook(() => useDeliveryLocation());

    await waitFor(() => expect(result.current.status).toBe("error"));
    expect(result.current.location).toEqual(FALLBACK_LOCATION);
  });

  it("sets status to denied and keeps the fallback location when permission is denied", async () => {
    const getCurrentPosition = jest.fn(
      (_success: GeoSuccess, error: GeoError) => {
        error({ code: 1, message: "User denied Geolocation" });
      },
    );
    Object.defineProperty(global.navigator, "geolocation", {
      value: { getCurrentPosition },
      configurable: true,
    });

    const { result } = renderHook(() => useDeliveryLocation());

    await waitFor(() => expect(result.current.status).toBe("denied"));
    expect(result.current.location).toEqual(FALLBACK_LOCATION);
  });

  it("updates the location and sets status to granted on successful reverse-geocode", async () => {
    const getCurrentPosition = jest.fn((success: GeoSuccess) => {
      success({ coords: { latitude: 12.3, longitude: 45.6 } });
    });
    Object.defineProperty(global.navigator, "geolocation", {
      value: { getCurrentPosition },
      configurable: true,
    });
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ city: "Paris", countryName: "France" }),
    }) as unknown as typeof fetch;

    const { result } = renderHook(() => useDeliveryLocation());

    await waitFor(() => expect(result.current.status).toBe("granted"));
    expect(result.current.location).toEqual({ city: "Paris", country: "France" });
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("latitude=12.3&longitude=45.6"),
    );
  });

  it("sets status to error without throwing when the reverse-geocode fetch fails", async () => {
    const getCurrentPosition = jest.fn((success: GeoSuccess) => {
      success({ coords: { latitude: 1, longitude: 2 } });
    });
    Object.defineProperty(global.navigator, "geolocation", {
      value: { getCurrentPosition },
      configurable: true,
    });
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({}),
    }) as unknown as typeof fetch;

    const { result } = renderHook(() => useDeliveryLocation());

    await waitFor(() => expect(result.current.status).toBe("error"));
    expect(result.current.location).toEqual(FALLBACK_LOCATION);
  });

  it("allows a manual requestLocation() retry after an initial denial", async () => {
    const getCurrentPosition = jest.fn(
      (_success: GeoSuccess, error: GeoError) => {
        error({ code: 1, message: "denied" });
      },
    );
    Object.defineProperty(global.navigator, "geolocation", {
      value: { getCurrentPosition },
      configurable: true,
    });

    const { result } = renderHook(() => useDeliveryLocation());
    await waitFor(() => expect(result.current.status).toBe("denied"));

    expect(getCurrentPosition).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.requestLocation();
    });

    await waitFor(() => expect(getCurrentPosition).toHaveBeenCalledTimes(2));
  });
});

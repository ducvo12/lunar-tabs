import { useState, ChangeEvent, useEffect } from "react";

// IndexedDB configuration
const DB_NAME = "WallpaperDB";
const DB_VERSION = 1;
const STORE_NAME = "wallpapers";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject("Error opening database");
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
  });
}

function saveImageToIndexedDB(file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    openDB()
      .then((db) => {
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const getRequest = store.get("wallpaperCollection");

        getRequest.onsuccess = () => {
          // If the record doesn't exist, initialize it with an empty array.
          let record = getRequest.result;
          if (!record) {
            record = { id: "wallpaperCollection", wallpapers: [] as Blob[] };
          }

          // Append the file (as a Blob) to the wallpapers array.
          record.wallpapers.push(file);

          const putRequest = store.put(record);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject("Error saving wallpaper.");
        };

        getRequest.onerror = () => reject("Error retrieving wallpaper collection.");

        transaction.onerror = () => {
          reject("Transaction error: " + transaction.error);
        };
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function loadImageFromIndexedDB(): Promise<Blob[] | null> {
  return new Promise((resolve, reject) => {
    openDB()
      .then((db) => {
        const transaction = db.transaction(STORE_NAME, "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get("wallpaperCollection");

        request.onsuccess = () => {
          if (request.result && request.result.wallpapers.length > 0) {
            resolve(request.result.wallpapers);
          } else {
            resolve(null);
          }
        };

        request.onerror = () => reject("Error loading image");
      })
      .catch(reject);
  });
}

const MenuWallpaper = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [wallpaperDataUrls, setWallpaperDataUrls] = useState<string[] | null>(null);
  const [wallpaperName, setWallpaperName] = useState("No file selected");
  const [wallpaperStatus, setWallpaperStatus] = useState("\u00A0");

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setWallpaperName(event.target.files[0].name);
    } else {
      setSelectedFile(null);
      setWallpaperName("No file selected");
    }
  };

  const handleSaveWallpaper = async () => {
    if (!selectedFile) {
      setWallpaperStatus("Please select an image first!");
      return;
    }
    try {
      await saveImageToIndexedDB(selectedFile);
      setWallpaperStatus("Image saved successfully!");
      handleLoad();
    } catch (error) {
      setWallpaperStatus("Failed to save image.");
      console.error(error);
    }
  };

  const handleLoad = async () => {
    try {
      const wallpapers = await loadImageFromIndexedDB();
      if (wallpapers) {
        const wallpaperURLs = wallpapers.map((wallpaper) => URL.createObjectURL(wallpaper));
        setWallpaperDataUrls([...wallpaperURLs]);
        setWallpaperStatus("Image loaded successfully!");
      } else {
        setWallpaperStatus("No image found.");
      }
    } catch (error) {
      setWallpaperStatus("Failed to load image.");
      console.error(error);
    }
  };

  useEffect(() => {
    handleLoad();
  }, []);

  return (
    <div
      className="w-full h-full
        grid grid-cols-2 gap-3"
    >
      <div className="flex flex-col">
        <div className="w-full h-fit bg-neutral-900 p-2 pl-3 rounded-lg mb-3">
          <div className="text-xl mb-1">Wallpapers</div>

          <div className="grid grid-cols-2 gap-2 mb-1">
            <input
              id="selectWallpaper"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="selectWallpaper"
              className="inline-block text-sm text-center
              w-full py-1
              text-gray-500 bg-blue-50 hover:bg-slate-200
              rounded cursor-pointer"
            >
              Select Wallpaper
            </label>

            <button
              onClick={handleSaveWallpaper}
              className="inline-block text-sm text-center
              w-full py-1
              text-gray-500 bg-blue-50 hover:bg-slate-200
              rounded cursor-pointer"
            >
              Save Wallpaper
            </button>
          </div>

          <div className="text-neutral-500">{wallpaperName}</div>
          <div className="text-neutral-500">{wallpaperStatus}</div>
        </div>

        <div className="h-full bg-neutral-900 p-2 rounded-lg grid grid-cols-3 grid-rows-4 gap-2">
          {wallpaperDataUrls ? (
            wallpaperDataUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt="Wallpaper"
                onClick={() => console.log("Wallpaper " + index + " clicked")}
                className="w-full h-full object-contain rounded-lg border border-neutral-700"
              />
            ))
          ) : (
            <p>Cannot Load Wallpapers</p>
          )}
        </div>
      </div>

      <div className="w-full h-full bg-neutral-900 p-2 pl-3 rounded-lg">
        <div className="flex flex-col justify-center">
          <div className="text-xl">Settings</div>
        </div>
      </div>
    </div>
  );
};

export default MenuWallpaper;

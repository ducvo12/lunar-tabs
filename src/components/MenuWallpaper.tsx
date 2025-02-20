import { useState, ChangeEvent, useEffect } from "react";
import { GoX } from "react-icons/go";

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

function removeImageFromIndexedDB(index: number): Promise<void> {
  return new Promise((resolve, reject) => {
    openDB()
      .then((db) => {
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get("wallpaperCollection");

        request.onsuccess = () => {
          const record = request.result;
          if (!record || record.wallpapers.length === 0) {
            resolve();
          }

          record.wallpapers.splice(index, 1);

          const putRequest = store.put(record);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject("Error saving wallpaper.");
        };
        request.onerror = () => reject("Error deleting image");
      })
      .catch(reject);
  });
}

const MenuWallpaper = () => {
  const [wallpaperStatus, setWallpaperStatus] = useState("No file selected");
  const [wallpaperCount, setWallpaperCount] = useState(0);

  const [wallpaperDataUrls, setWallpaperDataUrls] = useState<string[] | null>(null);
  const [wallpaperDataTypes, setWallpaperDataTypes] = useState<string[] | null>(null);
  const [curWallpaperIndex, setCurWallpaperIndex] = useState(-1);

  const handleSaveWallpaper = async (selectedFile: File) => {
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

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      handleSaveWallpaper(selectedFile);
    } else {
      setWallpaperStatus("No file selected");
    }
  };

  const handleLoad = async () => {
    const ind = localStorage.getItem("curWallpaperIndex");
    if (ind) {
      setWallpaper(parseInt(ind));
    }

    try {
      const wallpapers = await loadImageFromIndexedDB();
      if (wallpapers) {
        setWallpaperCount(wallpapers.length);

        const wallpaperURLs = [];
        const wallpaperTypes = [];
        for (let i = 0; i < wallpapers.length; i++) {
          wallpaperURLs.push(URL.createObjectURL(wallpapers[i]));
          wallpaperTypes.push(wallpapers[i].type.split("/")[0]);
        }
        // const wallpaperURLs = wallpapers.map((wallpaper) => URL.createObjectURL(wallpaper));
        setWallpaperDataUrls([...wallpaperURLs]);
        setWallpaperDataTypes([...wallpaperTypes]);
        setWallpaperStatus("Image loaded successfully!");
      } else {
        setWallpaperStatus("No image found.");
        setWallpaperDataUrls(null);
      }
    } catch (error) {
      setWallpaperStatus("Failed to load image.");
      console.error(error);
    }
  };

  const handleDelete = async (index: number) => {
    try {
      await removeImageFromIndexedDB(index);
      console.log(index, curWallpaperIndex);
      if (index === curWallpaperIndex) {
        setWallpaper(-1);
      } else if (index < curWallpaperIndex) {
        setWallpaper(curWallpaperIndex - 1);
      }
      handleLoad();
    } catch (error) {
      setWallpaperStatus("Failed to delete image.");
      console.error(error);
    }
  };

  const setWallpaper = (index: number) => {
    setCurWallpaperIndex(index);
    localStorage.setItem("curWallpaperIndex", index.toString());
  };

  useEffect(() => {
    handleLoad();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="w-full h-full
        grid grid-cols-2 gap-3"
    >
      <div className="flex flex-col">
        <div className="w-full h-fit mb-3 grid grid-cols-2 gap-x-2">
          <div className="bg-neutral-900 rounded-lg p-1">
            <div className="text-xl mb-1">Wallpapers</div>

            <div className="mb-1">
              <input
                id="selectWallpaper"
                type="file"
                accept="image/*,video/mp4,video/mov"
                onChange={handleFileChange}
                disabled={wallpaperCount >= 12}
                className="hidden"
              />
              <label
                htmlFor="selectWallpaper"
                className={`inline-block text-sm text-center
                  w-full py-1 rounded cursor-pointer
                  text-gray-500
                  ${
                    wallpaperCount >= 12 ? "bg-neutral-800" : "bg-neutral-50 hover:bg-neutral-300"
                  }`}
              >
                Select Wallpaper
              </label>
            </div>
          </div>

          <div className="bg-neutral-900 rounded-lg p-1">
            <div className="text-neutral-500">{wallpaperStatus}</div>
            <div className="text-neutral-500">{wallpaperCount}/12 wallpapers</div>
          </div>
        </div>

        <div className="h-full bg-neutral-900 p-2 rounded-lg grid grid-rows-4 grid-cols-3 gap-2">
          {wallpaperDataUrls ? (
            wallpaperDataUrls.map((url, index) => (
              <div
                className={`group relative w-full h-full rounded-lg
                  border transition-all
                  ${
                    index === curWallpaperIndex
                      ? "border-white"
                      : "border-neutral-700 hover:border-neutral-300"
                  }`}
              >
                <div
                  onClick={() => setWallpaper(index)}
                  key={index}
                  className="relative w-full h-full rounded-lg
                    flex justify-center items-center"
                >
                  {wallpaperDataTypes![index] === "image" ? (
                    <img
                      src={url}
                      alt="Wallpaper"
                      className="object-contain rounded-lg
                        cursor-pointer"
                    />
                  ) : (
                    <video
                      src={url}
                      muted
                      className="object-contain rounded-lg
                    cursor-pointer"
                    ></video>
                  )}
                </div>

                <div
                  onClick={() => handleDelete(index)}
                  className="absolute -right-1 -bottom-1
                    rounded-full h-4 w-4
                    bg-black/0 text-black/0 text-base
                    group-hover:bg-neutral-300
                    group-hover:text-black
                    transition-all"
                >
                  <GoX></GoX>
                </div>
              </div>
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

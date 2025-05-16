import { useState, useEffect } from 'react';
import { Card, Title, Button, Image, Box, Group, Modal, SimpleGrid } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import Cropper from 'react-easy-crop';

const IMAGE_KEYS = [
  { key: 'profile1', label: 'Profile Photo 1' },
  { key: 'profile2', label: 'Profile Photo 2' },
  { key: 'profile3', label: 'Profile Photo 3' },
  { key: 'family', label: 'Family Group Photo' },
  { key: 'nakshatra', label: 'Nakshatra Image' },
];

const DB_NAME = 'profile-images-db';
const STORE_NAME = 'images';
const DB_VERSION = 1;

// IndexedDB utility functions
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveImageToIndexedDB(key, blob) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(blob, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function getImageFromIndexedDB(key) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const request = tx.objectStore(STORE_NAME).get(key);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

async function deleteImageFromIndexedDB(key) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// Utility to create an HTMLImageElement from a URL
const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new window.Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

// Cropping logic using canvas, returns a Blob
const getCroppedImg = async (imageSrc, pixelCrop) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext('2d');

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        console.error('Canvas is empty');
        return;
      }
      resolve(blob);
    }, 'image/jpeg');
  });
};

export default function ProfileImagesManager({ images, setImages }) {
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [currentKey, setCurrentKey] = useState(null);
  const [image, setImage] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  // Load images from IndexedDB on mount
  useEffect(() => {
    let isMounted = true;
    (async () => {
      const loadedImages = {};
      for (const { key } of IMAGE_KEYS) {
        const blob = await getImageFromIndexedDB(key);
        if (blob) {
          const url = URL.createObjectURL(blob);
          loadedImages[key] = url;
        }
      }
      if (isMounted && Object.keys(loadedImages).length > 0) {
        setImages((prev) => ({ ...prev, ...loadedImages }));
      }
    })();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line
  }, []);

  const handleDrop = (files, key) => {
    const fileUrl = URL.createObjectURL(files[0]);
    setImage(fileUrl);
    setCurrentKey(key);
    setCropModalOpen(true);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  const handleCropSave = async () => {
    const croppedBlob = await getCroppedImg(image, croppedAreaPixels);
    await saveImageToIndexedDB(currentKey, croppedBlob);
    const url = URL.createObjectURL(croppedBlob);
    setImages((prev) => ({ ...prev, [currentKey]: url }));
    setCropModalOpen(false);
    setImage(null);
    setCurrentKey(null);
  };

  const handleClearImage = async (key) => {
    await deleteImageFromIndexedDB(key);
    setImages((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  };

  const onCropComplete = (_, croppedPixels) => setCroppedAreaPixels(croppedPixels);

  return (
    <Card shadow="sm" padding="lg">
      <Title order={4}>Upload Photos</Title>
      <SimpleGrid cols={1} spacing="md">
        {IMAGE_KEYS.map(({ key, label }) => (
          <Box key={key}>
            <Title order={6}>{label}</Title>
            {images[key] ? (
              <>
                <Image src={images[key]} alt={label} radius="md" mb="sm" />
                <Button
                  color="red"
                  size="xs"
                  mb="sm"
                  onClick={() => handleClearImage(key)}
                  style={{ marginBottom: 8 }}
                >
                  Clear Image
                </Button>
              </>
            ) : (
              <Dropzone onDrop={(files) => handleDrop(files, key)}>
                <Box p="md" style={{ textAlign: 'center' }}>
                  Drag or click to upload {label}
                </Box>
              </Dropzone>
            )}
            <Button
              fullWidth
              mt="xs"
              variant="light"
              onClick={() => {
                setImage(images[key]);
                setCurrentKey(key);
                setCropModalOpen(true);
                setCrop({ x: 0, y: 0 });
                setZoom(1);
              }}
              disabled={!images[key]}
            >
              Edit {label}
            </Button>
          </Box>
        ))}
      </SimpleGrid>
      <Modal opened={cropModalOpen} onClose={() => setCropModalOpen(false)} title="Crop Image" size="lg">
        {image && (
          <Box style={{ position: 'relative', width: '100%', height: 400 }}>
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              objectFit="cover"
              aspect={currentKey === 'family' ? 5 / 3 : 3 / 4}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </Box>
        )}
        <Group position="apart" mt="md">
          <Button onClick={() => setCropModalOpen(false)} variant="default">Cancel</Button>
          <Button onClick={handleCropSave} color="blue">Crop</Button>
        </Group>
      </Modal>
    </Card>
  );
}

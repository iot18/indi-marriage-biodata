import { useState, useEffect } from 'react';
import {
  Card, Title, Button, Image, Box, Group, Modal, SimpleGrid, Text,
  ActionIcon, Stack, Center
} from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import Cropper from 'react-easy-crop';
import { IconPhotoEdit, IconTrash, IconUpload } from '@tabler/icons-react';

// Constants
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

// IndexedDB utils
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME);
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

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = (e) => reject(e);
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

const getCroppedImg = async (imageSrc, pixelCrop) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);
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
      if (isMounted) setImages((prev) => ({ ...prev, ...loadedImages }));
    })();
    return () => { isMounted = false };
  }, []); // eslint-disable-line

  const handleDrop = (files, key) => {
    const fileUrl = URL.createObjectURL(files[0]);
    setImage(fileUrl);
    setCurrentKey(key);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCropModalOpen(true);
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
    <Card shadow="sm" padding="lg" radius="md">
      <Title order={4} mb="md">Upload Photos</Title>
      <SimpleGrid cols={1} spacing="md" breakpoints={[{ maxWidth: 768, cols: 1 }]}>
        {IMAGE_KEYS.map(({ key, label }) => (
          <Card key={key} shadow="xs" radius="md" p="sm" withBorder>
            <Stack spacing="xs">
              <Title order={6}>{label}</Title>
              {images[key] ? (
                <Box style={{ position: 'relative' }}>
                  <Image src={images[key]} radius="sm" height={180} withPlaceholder />
                  <Group position="right" mt="xs">
                    <ActionIcon color="blue" onClick={() => {
                      setImage(images[key]);
                      setCurrentKey(key);
                      setCropModalOpen(true);
                      setCrop({ x: 0, y: 0 });
                      setZoom(1);
                    }}>
                      <IconPhotoEdit size={18} />
                    </ActionIcon>
                    <ActionIcon color="red" onClick={() => handleClearImage(key)}>
                      <IconTrash size={18} />
                    </ActionIcon>
                  </Group>
                </Box>
              ) : (
                <Dropzone onDrop={(files) => handleDrop(files, key)} style={{ minHeight: 180, borderRadius: 8 }}>
                  <Center p="md" style={{ height: '100%' }}>
                    <Stack align="center" spacing="xs">
                      <IconUpload size={24} />
                      <Text size="sm" color="dimmed" align="center">
                        Drag or click to upload<br />{label}
                      </Text>
                    </Stack>
                  </Center>
                </Dropzone>
              )}
            </Stack>
          </Card>
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
          <Button variant="default" onClick={() => setCropModalOpen(false)}>Cancel</Button>
          <Button color="blue" onClick={handleCropSave}>Crop</Button>
        </Group>
      </Modal>
    </Card>
  );
}

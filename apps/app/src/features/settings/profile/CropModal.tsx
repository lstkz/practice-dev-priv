import React from 'react';
import Cropper from 'react-easy-crop';
import { Area } from 'react-easy-crop/types';
import { Button } from 'src/components/Button';

import { Modal, ModalRef } from 'src/components/GenericModal';
import tw from 'twin.macro';
import getCroppedImg from './helper';

export interface CropModalRef {
  open: (img: string) => void;
}

interface CropModalProps {
  onImage: (img: Blob) => void;
}

export const CropModal = React.forwardRef<CropModalRef, CropModalProps>(
  (props, ref) => {
    const { onImage } = props;
    const modalRef = React.useRef<ModalRef>(null!);
    const [crop, setCrop] = React.useState({ x: 0, y: 0 });
    const [zoom, setZoom] = React.useState(1);
    const [img, setImg] = React.useState('');
    const [croppedAreaPixels, setCroppedAreaPixels] = React.useState<Area>(
      null!
    );

    React.useImperativeHandle(ref, () => {
      return {
        open: img => {
          setCrop({ x: 0, y: 0 });
          setZoom(1);
          setImg(img);
          modalRef.current.open();
        },
      };
    });
    const hide = () => {
      modalRef.current.hide();
    };
    return (
      <Modal
        noClose
        noBgClose
        ref={modalRef}
        wrapperCss={[tw`w-auto! h-auto! max-w-none! p-0!`]}
      >
        <div tw=" bg-white  ">
          <div tw="relative" style={{ height: 400, width: 500 }}>
            <Cropper
              image={img}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onCropComplete={(_, croppedAreaPixels) => {
                setCroppedAreaPixels(croppedAreaPixels);
              }}
              onZoomChange={setZoom}
            />
          </div>
          <div tw="p-3 space-x-2 flex justify-center">
            <Button
              type="primary"
              onClick={async () => {
                const ret = await getCroppedImg(img, croppedAreaPixels);
                onImage(ret);
                hide();
              }}
            >
              Upload
            </Button>
            <Button type="white" onClick={hide}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
);

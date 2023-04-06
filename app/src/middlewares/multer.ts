import multer from 'multer';
import {v4} from 'uuid';
import path from 'path';
import * as os from 'os';

const storage = multer.diskStorage({
    destination: os.tmpdir(),
    filename: (req: any, file: any, cb: any) => {
        cb(null, v4() + path.extname(file.originalname));
    }
});

export default multer({storage});
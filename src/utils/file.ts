import * as fs from 'fs';
import * as path from 'path';

export const fileType = (file: any) => {
    const typeList = file.originalname.split('.');
    const type = typeList.length ? typeList[typeList.length - 1] : ''
    let dir: string;
    if (/\.(png|jpe?g|gif|svg)(\?\S*)?$/.test(file.originalname)) {
        dir = 'images';
    } else if (/\.(mp3)(\?\S*)?$/.test(file.originalname)) {
        dir = 'audio';
    } else if (/\.mp4|avi/.test(file.originalname)) {
        dir = 'video';
    } else if (/\.(doc|txt)(\?\S*)?$/.test(file.originalname)) {
        dir = 'doc';
    } else {
        dir = 'other';
    }
    return dir;
};

/**
 * 读取路径信息
 * @param {string} path 路径
 */
function getStat(p: string) {
    return new Promise((resolve, reject) => {
        fs.stat(p, (err, stats) => {
            if (err) {
                resolve(false);
            } else {
                resolve(stats);
            }
        });
    });
}

/**
 * 创建路径
 * @param {string} dir 路径
 */
function mkdir(dir) {
    return new Promise((resolve, reject) => {
        fs.mkdir(dir, err => {
            if (err) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
}

/**
 * 路径是否存在，不存在则创建
 * @param {string} dir 路径
 */
export const dirExists = async(dir) => {
    const isExists = await getStat(dir);
    // @ts-ignore
    if (isExists && isExists.isDirectory()) {
        return true;
    } else if (isExists) {     // 如果该路径存在但是文件，返回false
        return false;
    }
    // 如果该路径不存在
    const tempDir = path.parse(dir).dir;      // 拿到上级路径
    // 递归判断，如果上级目录也不存在，则会代码会在此处继续循环执行，直到目录存在
    const status = await dirExists(tempDir);
    let mkdirStatus;
    if (status) {
        mkdirStatus = await mkdir(dir);
    }
    return mkdirStatus;
}

// 샘플 이미지 다운로드 스크립트
// Node.js 환경에서 실행해야 합니다.
// 실행 방법: node download_sample_images.js

const fs = require('fs');
const https = require('https');
const path = require('path');

// 다운로드할 이미지 URL 목록
const imageUrls = [
    {
        url: 'https://images.unsplash.com/photo-1537907510278-a4d35a3be11d',
        filename: 'cover.jpg',
        description: '배경 이미지'
    },
    {
        url: 'https://images.unsplash.com/photo-1527203561188-dae1bc1a417f',
        filename: 'placeholder1.jpg',
        description: '갤러리 이미지 1'
    },
    {
        url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486',
        filename: 'placeholder2.jpg',
        description: '갤러리 이미지 2'
    },
    {
        url: 'https://images.unsplash.com/photo-1481653125770-b78c206c59d4',
        filename: 'placeholder3.jpg',
        description: '갤러리 이미지 3'
    },
    {
        url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74',
        filename: 'placeholder4.jpg',
        description: '갤러리 이미지 4'
    },
    {
        url: 'https://maps.googleapis.com/maps/api/staticmap?center=서울역&zoom=15&size=600x400&markers=color:red%7C서울역&key=AIzaSyB_7iUvgW6rKyevuBCw7nVfZmYR2Z7LH1U',
        filename: 'map_placeholder.jpg',
        description: '지도 이미지'
    }
];

// images 폴더가 없으면 생성
if (!fs.existsSync(path.join(__dirname, 'images'))) {
    fs.mkdirSync(path.join(__dirname, 'images'));
}

console.log('샘플 이미지 다운로드 중...');

// 이미지 다운로드 함수
const downloadImage = (imageUrl, outputPath, description) => {
    return new Promise((resolve, reject) => {
        https.get(imageUrl, (response) => {
            // 응답 상태 코드가 200(성공)이 아니면 오류
            if (response.statusCode !== 200) {
                reject(new Error(`다운로드 실패. 상태 코드: ${response.statusCode}`));
                return;
            }

            const fileStream = fs.createWriteStream(outputPath);
            response.pipe(fileStream);

            // 다운로드 진행 상황 표시
            const totalBytes = parseInt(response.headers['content-length'], 10);
            let downloadedBytes = 0;
            
            response.on('data', (chunk) => {
                downloadedBytes += chunk.length;
                if (totalBytes) {
                    const progress = (downloadedBytes / totalBytes * 100).toFixed(2);
                    process.stdout.write(`${description} 다운로드 진행률: ${progress}% (${(downloadedBytes / 1024 / 1024).toFixed(2)}MB / ${(totalBytes / 1024 / 1024).toFixed(2)}MB)\r`);
                } else {
                    process.stdout.write(`${description} 다운로드 중... ${(downloadedBytes / 1024 / 1024).toFixed(2)}MB\r`);
                }
            });

            fileStream.on('finish', () => {
                fileStream.close();
                console.log(`\n${description} 다운로드 완료!`);
                resolve();
            });

            fileStream.on('error', (err) => {
                fs.unlink(outputPath, () => {}); // 파일 삭제 시도
                reject(err);
            });

            response.on('error', (err) => {
                fs.unlink(outputPath, () => {}); // 파일 삭제 시도
                reject(err);
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
};

// 이미지 순차적으로 다운로드
async function downloadAllImages() {
    for (const image of imageUrls) {
        const outputPath = path.join(__dirname, 'images', image.filename);
        try {
            await downloadImage(image.url, outputPath, image.description);
        } catch (err) {
            console.error(`${image.description} 다운로드 오류:`, err.message);
        }
    }
    
    console.log('\n모든 샘플 이미지 다운로드가 완료되었습니다!');
    console.log('이미지는 images/ 폴더에 저장되었습니다.');
    console.log('\n이제 청첩장을 커스터마이징하세요:');
    console.log('1. index.html: 이름, 날짜, 장소 등 정보 수정');
    console.log('2. script.js: 결혼 날짜 정보 수정 (createCalendar 함수 내)');
    console.log('3. 필요에 따라 styles.css 파일에서 디자인 조정');
}

// 다운로드 실행
downloadAllImages().catch(err => {
    console.error('오류 발생:', err.message);
}); 
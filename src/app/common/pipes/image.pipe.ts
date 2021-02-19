import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'getLargeImage',
    pure: true
  })

  export class GetLargeImagePipe implements PipeTransform {

    transform(pathToImage: string, args?: any): any {
        let img = pathToImage.replace('.tmb', '');
        img = img.replace('small_thumb.png', 'original.png');
        img = img.replace('small_thumb.jpg', 'original.jpg');
        img = img.replace('small_thumb.jpeg', 'original.jpeg');
        console.log('image.pipe.ts pathToImage:', pathToImage);
        console.log('image.pipe.ts img:', img);
        return img;
    }
  }
 
  @Pipe({
    name: 'getImageThumbPipe',
    pure: true
  })
  export class GetImageThumbPipe implements PipeTransform {

    transform(pathToImage: string, args?: any): any {
      console.log('image.pipe.ts GetImageThumbPipe pathToImage:', pathToImage);
      console.log('image.pipe.ts GetImageThumbPipe args:', args);
        if(pathToImage === '' || pathToImage === undefined){
          return this.getDefaultImage(args);
        }

        if(pathToImage.indexOf('.tmb.') > 0){
          return pathToImage;
        }
      
        let img = pathToImage.replace('.png', '.tmb.png');
        img = img.replace('.jpg', '.tmb.jpg');
        img = img.replace('.jpeg', '.tmb.jpeg');
        console.log('image.pipe.ts GetImageThumbPipe img:', img);
      
        return img;
    }
    getDefaultImage(type: string){
        let path = '';
        switch(type.toLocaleLowerCase()){
            case 'store':
                path = '/assets/images/store.svg';
                break;
        }

        return path;
    }
  }
 
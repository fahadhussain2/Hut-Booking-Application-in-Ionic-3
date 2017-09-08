export class Upload{
    $key: string;
    file: File;
    name: string;
    url: string;
    base64Img: any;
    progress: number;
    createdAt: Date = new Date();
    bookedDate: Date ;

    constructor(file: File){
        this.file = file;
    }
}
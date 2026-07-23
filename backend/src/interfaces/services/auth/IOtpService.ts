export interface IOtpService {
    generateOtp(): string;

    hashOtp(otp: string): Promise<string>;

    compareOtp(
        plainOtp: string,
        hashedOtp: string,
    ): Promise<boolean>;

    getExpiryTime(minutes?: number): Date;
}
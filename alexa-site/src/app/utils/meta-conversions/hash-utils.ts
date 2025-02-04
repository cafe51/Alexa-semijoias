import crypto from 'crypto';

export class HashUtils {
    static normalizeEmail(email: string): string {
        return email.trim().toLowerCase();
    }

    static normalizePhone(phone: string): string {
        // Remove todos os caracteres não numéricos e adiciona o código do país (Brasil - 55)
        const normalized = phone.replace(/\D/g, '');
        return normalized.startsWith('55') ? normalized : `55${normalized}`;
    }

    static normalizeName(name: string): string {
        return name.trim().toLowerCase();
    }

    static sha256Hash(input: string): string {
        return crypto
            .createHash('sha256')
            .update(input)
            .digest('hex');
    }

    static hashUserData(data: { 
        email?: string,
        phone?: string,
        firstName?: string,
        lastName?: string,
    }): {
        em?: string[],
        ph?: string[],
        fn?: string[],
        ln?: string[],
    } {
        const hashedData: {
            em?: string[],
            ph?: string[],
            fn?: string[],
            ln?: string[],
        } = {};

        if (data.email) {
            const normalizedEmail = this.normalizeEmail(data.email);
            hashedData.em = [this.sha256Hash(normalizedEmail)];
        }

        if (data.phone) {
            const normalizedPhone = this.normalizePhone(data.phone);
            hashedData.ph = [this.sha256Hash(normalizedPhone)];
        }

        if (data.firstName) {
            const normalizedFirstName = this.normalizeName(data.firstName);
            hashedData.fn = [this.sha256Hash(normalizedFirstName)];
        }

        if (data.lastName) {
            const normalizedLastName = this.normalizeName(data.lastName);
            hashedData.ln = [this.sha256Hash(normalizedLastName)];
        }

        return hashedData;
    }
}

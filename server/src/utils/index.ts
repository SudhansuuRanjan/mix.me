/**
 * @param length generate random string of length n
 * @returns random string
 * @description generates a random string of length n
 * @example generateRandomString(16) // returns "X6xs5f8s5f8s5f8s"
 * @example generateRandomString(32) // returns "X6xs5f8s5f8s5f8s5f8s5f8s5f8s5f8s"
 */
export const generateRandomString = (length: number) => {
    let result = '';
    const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++)
        result += characters.charAt(Math.floor(Math.random() * charactersLength));

    return result;
}
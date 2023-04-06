import crypto from "crypto";

const createCrypto = () => crypto.randomBytes(40).toString("hex");

export default createCrypto;

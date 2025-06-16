# Script to generate SSL certificates using a custom CA

# Variables
SSL_DIR="nginx/ssl"
CA_KEY="${SSL_DIR}/ca.key"
CA_CERT="${SSL_DIR}/ca.crt"
SERVER_KEY="${SSL_DIR}/nginx.key"
SERVER_CSR="${SSL_DIR}/nginx.csr"
SERVER_CERT="${SSL_DIR}/nginx.crt"
SERVER_CN="www.nwh-host.org" # Common Name for your server certificate
CA_CN="My Custom FIDO CA"    # Common Name for your CA

# Clean up previous SSL files and create directory
rm -rf nginx/ssl
mkdir -p nginx/ssl

echo "Generating CA private key: ${CA_KEY}"
openssl genrsa -out "${CA_KEY}" 2048

echo "Generating CA certificate: ${CA_CERT}"
openssl req -x509 -new -nodes -key "${CA_KEY}" -sha256 -days 1024 \
    -out "${CA_CERT}" \
    -subj "/CN=${CA_CN}"

echo "Generating Server private key: ${SERVER_KEY}"
openssl genrsa -out "${SERVER_KEY}" 2048

echo "Generating Server CSR: ${SERVER_CSR}"
openssl req -new -key "${SERVER_KEY}" \
    -out "${SERVER_CSR}" \
    -subj "/CN=${SERVER_CN}"

echo "Signing Server CSR with CA: ${SERVER_CERT}"
openssl x509 -req -in "${SERVER_CSR}" -CA "${CA_CERT}" -CAkey "${CA_KEY}" -CAcreateserial \
    -out "${SERVER_CERT}" -days 365 -sha256

echo "SSL Certificates generated in ${SSL_DIR}:"
echo "  CA Certificate: ${CA_CERT}"
echo "  Server Key: ${SERVER_KEY}"
echo "  Server Certificate: ${SERVER_CERT}"
echo "Important: For browsers to trust this setup, you may need to import ${CA_CERT} into your browser/system's trusted CA store."

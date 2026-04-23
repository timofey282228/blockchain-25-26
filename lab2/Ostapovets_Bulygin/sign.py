"""
Generate an ECDSA signature for SignatureNotary.

Requires: pip install eth-account eth-utils

This produces (messageHash, v, r, s, signerAddress) that you can paste
directly into `approve(...)` in Remix or feed into a test script.
"""

from eth_account import Account
from eth_account.messages import encode_defunct
from eth_utils import keccak, to_hex
import sys

# 1. Keypair (deterministic for demo; regenerate for real use)
PRIVATE_KEY = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
acct = Account.from_key(PRIVATE_KEY)
print("Signer address:", acct.address)

# 2. Message and its hash
if len(sys.argv) > 1:
    message = sys.argv[1].encode()
else:
    message = b"This message is provided to you by a verified source"
print("Message:", message)
message_hash = keccak(message)
print("messageHash:", to_hex(message_hash))

# 3. Sign the raw hash (NOT the eth_sign prefixed form — the contract
#    uses ecrecover directly on messageHash, so we sign the hash itself).
signed = Account._sign_hash(message_hash, private_key=PRIVATE_KEY)

print("v:", signed.v)
print("r:", to_hex(signed.r.to_bytes(32, "big")))
print("s:", to_hex(signed.s.to_bytes(32, "big")))

# 4. Sanity: enforce low-s (malleability guard)
SECP256K1_N = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141
if signed.s > SECP256K1_N // 2:
    print("High-s detected; flipping to canonical low-s form.")
    s_low = SECP256K1_N - signed.s
    v_flipped = 27 if signed.v == 28 else 28
    print("v (fixed):", v_flipped)
    print("s (fixed):", to_hex(s_low.to_bytes(32, "big")))

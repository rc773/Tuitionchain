import { Utils, hash160, PubKey, Sig, assert, ByteString, hash256, method, prop, SmartContract, toHex } from 'scrypt-ts'

export class Pay extends SmartContract {

  static readonly LOCKTIME_BLOCK_HEIGHT_MARKER = 500000000
  static readonly UINT_MAX = 0xffffffffn

  // withdraw interval limit in seconds
  @prop()
  withdrawIntervals: bigint;

  // how many satoshis can be withdrawn each time
  @prop()
  withdrawAmount: bigint;

  // public key of the creator, the creator is student
  @prop()
  studentPublicKey: PubKey;

  // public key of the univerity
  @prop()
  universityPublicKey: PubKey;

  // locktime of last withdraw tx
  @prop(true)
  lastWithdrawTimestamp: bigint;

  constructor(withdrawIntervals: bigint, withdrawAmount: bigint, lastWithdrawTimestamp: bigint, studentPublicKey: PubKey, universityPublicKey: PubKey) {
    super(...arguments);
    this.withdrawIntervals = withdrawIntervals;
    this.withdrawAmount = withdrawAmount;
    this.lastWithdrawTimestamp = lastWithdrawTimestamp;
    this.studentPublicKey = studentPublicKey;
    this.universityPublicKey = universityPublicKey;
  } 
@method()
  public withdraw() {
    // enable locktime
    // https://wiki.bitcoinsv.io/index.php/NLocktime_and_nSequence
    assert(this.ctx.sequence < Pay.UINT_MAX, 'input sequence should be less than UINT_MAX');
    assert(this.ctx.locktime >= Pay.LOCKTIME_BLOCK_HEIGHT_MARKER, 'locktime does not use unix timestamp')
    // require meets the call interval limits
    assert(this.ctx.locktime - this.lastWithdrawTimestamp >= this.withdrawIntervals, 'locktime does not meet the call interval limit [1]');
    assert(this.ctx.locktime - this.lastWithdrawTimestamp < 2n * this.withdrawIntervals, 'locktime does not meet the call interval limit [2]');

    assert(this.withdrawAmount < this.ctx.utxo.value, 'insufficient balance')

    this.lastWithdrawTimestamp = this.ctx.locktime;

    const contractOutput: ByteString = this.buildStateOutput(this.ctx.utxo.value - this.withdrawAmount)
    const withdrawOutput: ByteString = Utils.buildPublicKeyHashOutput(hash160(this.universityPublicKey), this.withdrawAmount)
    const expectedOutputs: ByteString = contractOutput + withdrawOutput + this.buildChangeOutput();
    assert(this.ctx.hashOutputs == hash256(expectedOutputs), 'hashOutputs dismatch');
  }

  @method()
  public deposit(depositAmount: bigint, sig: Sig) {
    // only the student can deposit
    assert(this.checkSig(sig, this.studentPublicKey), 'checkSig failed');
    // avoid stealing money from the contract
    assert(depositAmount > 0, 'deposit amount should be positive');

    const contractOutput: ByteString = this.buildStateOutput(this.ctx.utxo.value + depositAmount)
    const expectedOutputs: ByteString = contractOutput + this.buildChangeOutput()
    assert(this.ctx.hashOutputs == hash256(expectedOutputs), 'hashOutputs dismatch');
  }

  @method()
  public destroy(sig: Sig) {
    // only the student can destroy
    assert(this.checkSig(sig, this.studentPublicKey), 'checkSig failed');
  }
} 

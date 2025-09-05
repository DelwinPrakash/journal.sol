import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import type { Crud } from "../target/types/crud.ts";
import { PublicKey } from "@solana/web3.js";
import { assert } from "chai";
import fs from "fs";

describe("crud", () => {
  console.log("Current working directory:", process.cwd());

  // Configure the client to use the local cluster.
  const idl = JSON.parse(fs.readFileSync("anchor/target/idl/crud.json", "utf8"));
  const programId = new anchor.web3.PublicKey("H7sTLwAkDhLx21G9NdK6Beimi9jnq73jA3Fc2VwmTsnX");

  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = new anchor.Program<Crud>(idl, provider);
  const owner = provider.wallet;

  const title = "my-first-journal";
  const initialContent = "Hello Anchor!";
  const updatedContent = "Updated content here";

  let journalPda: PublicKey;
  let bump: number;

  before(async () => {
    [journalPda, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from(title), owner.publicKey.toBuffer()],
      program.programId
    );
  });

  it("Initialize Journal Entry", async () => {
    await program.methods
      .initializeJournal(title, initialContent)
      .accounts({
        journalEntry: journalPda,
        owner: owner.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    const account = await program.account.journalEntry.fetch(journalPda);
    assert.equal(account.owner.toBase58(), owner.publicKey.toBase58());
    assert.equal(account.title, title);
    assert.equal(account.content, initialContent);
  });

  it("Update Journal Entry", async () => {
    await program.methods
      .updateJournalEntry(updatedContent, title)
      .accounts({
        journalEntry: journalPda,
        owner: owner.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    const account = await program.account.journalEntry.fetch(journalPda);
    assert.equal(account.content, updatedContent);
  });

  it("Delete Journal Entry", async () => {
    await program.methods
      .deleteJournalEntry(title)
      .accounts({
        journalEntry: journalPda,
        owner: owner.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    // After closing, fetching should fail
    try {
      await program.account.journalEntry.fetch(journalPda);
      assert.fail("Journal should have been deleted");
    } catch (err) {
      assert.include(err.toString(), "Account does not exist");
    }
  });
});

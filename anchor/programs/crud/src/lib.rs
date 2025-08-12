#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("JAVuBXeBZqXNtS73azhBDAoYaaAFfo4gWXoZe2e7Jf8H");

#[program]
pub mod crud {
    use super::*;

    pub fn initializeJounel(ctx: Context<CreateJournelEntry>, title: String) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(title: String)]
pub struct CreateJournelEntry<'info>{
    #[account(
        init,
        payer = owner,
        seeds = [title.as_bytes(), owner.key().as_ref()],
        bump,
        space = 8 + JornelEntry::INIT_SPACE,
    )]
    pub journel_entry: Account<'info, JornelEntry>,

    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[account]
#[derive(InitSpace)]
pub struct JornelEntry {
    pub owner: Pubkey,
    #[max_len(20)]
    pub title: String,
    #[max_len(500)]
    pub content: String
}
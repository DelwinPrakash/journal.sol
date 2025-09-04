#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;
declare_id!("H7sTLwAkDhLx21G9NdK6Beimi9jnq73jA3Fc2VwmTsnX");

#[program]
pub mod crud {
    use super::*;

    pub fn initialize_journal(ctx: Context<CreateJournalEntry>, title: String, content: String) -> Result<()> {
        let journal_entry = &mut ctx.accounts.journal_entry;

        journal_entry.owner = ctx.accounts.owner.key();
        journal_entry.title = title;
        journal_entry.content = content;
        
        Ok(())
    }

    pub fn update_journal_entry(ctx: Context<UpdateJournalEntry>, content: String, _title: String) -> Result<()>{
        let journal_entry = &mut ctx.accounts.journal_entry;
        journal_entry.content = content;
        
        Ok(())
    }

    pub fn delete_journal_entry(_ctx: Context<DeleteJournalEntry>, _title: String) -> Result<()>{
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(title: String)]
pub struct CreateJournalEntry<'info>{
    #[account(
        init,
        payer = owner,
        seeds = [title.as_bytes(), owner.key().as_ref()],
        bump,
        space = 8 + JournalEntry::INIT_SPACE,
    )]
    pub journal_entry: Account<'info, JournalEntry>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
#[instruction(title: String, content: String)]
pub struct UpdateJournalEntry<'info> {
    #[account(
        mut,
        seeds = [title.as_bytes(), owner.key().as_ref()],
        bump,
        realloc = 8 + 32 + 4 + title.len() + 4 + content.len(),
        realloc::payer = owner,
        realloc::zero = true,
    )]
    pub journal_entry: Account<'info, JournalEntry>,
    
    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
#[instruction(title: String)]
pub struct DeleteJournalEntry<'info> {
    #[account(
        mut,
        close = owner,
        seeds = [title.as_bytes(), owner.key().as_ref()],
        bump
    )]
    pub journal_entry: Account<'info, JournalEntry>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>
}

#[account]
#[derive(InitSpace)]
pub struct JournalEntry {
    pub owner: Pubkey,
 
    #[max_len(20)]
    pub title: String,
 
    #[max_len(500)]
    pub content: String
}
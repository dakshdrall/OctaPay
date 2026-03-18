#![no_std]

use soroban_sdk::{contractimpl, symbol, Address, Env, Map, Symbol};

#[derive(Clone)]
pub struct LoanStatus {
    pub collateral: i128,
    pub borrowed: i128,
    pub repaid: i128,
    pub health_factor: i128,
}

pub struct LendingContract;

const LOAN_PREFIX: Symbol = symbol!("loan");

impl LendingContract {
    fn storage_key(user: &Address) -> (Symbol, Address) {
        (LOAN_PREFIX, user.clone())
    }

    fn get_loan(env: &Env, user: &Address) -> (i128, i128, i128) {
        let key = Self::storage_key(user);
        let data: Option<Map<Symbol, i128>> = env.storage().get(&key);
        if let Some(map) = data {
            (
                map.get(&symbol!("collateral")).unwrap_or(0),
                map.get(&symbol!("borrowed")).unwrap_or(0),
                map.get(&symbol!("repaid")).unwrap_or(0),
            )
        } else {
            (0, 0, 0)
        }
    }

    fn set_loan(env: &Env, user: &Address, collateral: i128, borrowed: i128, repaid: i128) {
        let key = Self::storage_key(user);
        let mut map = Map::new();
        map.set(symbol!("collateral"), collateral);
        map.set(symbol!("borrowed"), borrowed);
        map.set(symbol!("repaid"), repaid);
        env.storage().set(&key, &map);
    }

    fn compute_health_factor(collateral: i128, borrowed: i128, repaid: i128) -> i128 {
        if borrowed == 0 {
            return i128::MAX;
        }
        // Simple health factor: (collateral * 100) / (borrowed - repaid)
        let outstanding = borrowed.saturating_sub(repaid);
        if outstanding <= 0 {
            return i128::MAX;
        }
        (collateral * 100) / outstanding
    }
}

#[contractimpl]
impl LendingContract {
    pub fn deposit_collateral(env: Env, user: Address, amount: i128) {
        let (collateral, borrowed, repaid) = Self::get_loan(&env, &user);
        let new_collateral = collateral.saturating_add(amount);
        Self::set_loan(&env, &user, new_collateral, borrowed, repaid);
    }

    pub fn get_borrow_limit(env: Env, user: Address) -> i128 {
        let (collateral, _, _) = Self::get_loan(&env, &user);
        // 60% of collateral
        (collateral * 60) / 100
    }

    pub fn borrow(env: Env, user: Address, amount: i128) {
        let (collateral, borrowed, repaid) = Self::get_loan(&env, &user);
        let max = (collateral * 60) / 100;
        let outstanding = borrowed.saturating_sub(repaid);
        let available = max.saturating_sub(outstanding);
        if amount > available {
            env.panic("Borrow amount exceeds limit")
        }
        let new_borrowed = borrowed.saturating_add(amount);
        Self::set_loan(&env, &user, collateral, new_borrowed, repaid);
    }

    pub fn repay(env: Env, user: Address, amount: i128) {
        let (collateral, borrowed, repaid) = Self::get_loan(&env, &user);
        let new_repaid = repaid.saturating_add(amount);
        Self::set_loan(&env, &user, collateral, borrowed, new_repaid);
    }

    pub fn get_loan_status(env: Env, user: Address) -> LoanStatus {
        let (collateral, borrowed, repaid) = Self::get_loan(&env, &user);
        let health_factor = Self::compute_health_factor(collateral, borrowed, repaid);
        LoanStatus {
            collateral,
            borrowed,
            repaid,
            health_factor,
        }
    }

    pub fn liquidate(env: Env, user: Address) {
        let (collateral, borrowed, repaid) = Self::get_loan(&env, &user);
        let health_factor = Self::compute_health_factor(collateral, borrowed, repaid);
        if health_factor >= 100 {
            env.panic("Loan is healthy")
        }
        // Simple liquidation: wipe loan and collateral
        Self::set_loan(&env, &user, 0, 0, 0);
    }
}
